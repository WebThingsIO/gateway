extern crate proc_macro;

use std::{
    fs::{self, File},
    path::PathBuf,
};

use proc_macro::TokenStream;

use convert_case::{Case, Casing};
use serde_json::Value;

struct SchemaFile {
    path: PathBuf,
    schema: Value,
}

impl SchemaFile {
    pub fn new(path: PathBuf) -> Self {
        let schema = Self::schema(&path);
        Self { path, schema }
    }

    fn schema(path: &PathBuf) -> Value {
        serde_json::from_reader(
            File::open(path).expect(&format!("Open schema file {}", path.display())),
        )
        .expect(&format!("Parse JSON schema {}", path.display()))
    }

    pub fn name(&self) -> String {
        self.path
            .file_stem()
            .unwrap()
            .to_str()
            .unwrap()
            .to_case(Case::Pascal)
    }

    pub fn id(&self) -> i64 {
        self.schema
            .as_object()
            .expect("Schema root is object")
            .get("properties")
            .expect("Schema has properties")
            .as_object()
            .expect("Schema properties is object")
            .get("messageType")
            .expect("Schema has messageType")
            .as_object()
            .expect("Schema messageType is object")
            .get("const")
            .expect("Schema messageType is const")
            .as_i64()
            .expect("Schema messageType is integer")
    }

    pub fn path_str(&self) -> String {
        self.path.display().to_string()
    }
}

#[proc_macro]
pub fn declare_messages(tokens: TokenStream) -> TokenStream {
    if !tokens.is_empty() {
        panic!("Macro expects no parameters");
    }

    let crate_root = PathBuf::from(std::env::var("CARGO_MANIFEST_DIR").unwrap());
    let crate_root = crate_root.parent().unwrap();
    let folder = crate_root.join(PathBuf::from(
        "gateway_addon/gateway-addon-ipc-schema/messages",
    ));
    let mut files = Vec::new();
    for entry in fs::read_dir(folder.clone()).unwrap() {
        let path = entry.unwrap().path();
        let file = SchemaFile::new(path);
        if file.name() == "Definitions" {
            continue;
        }
        files.push(file);
    }

    // println!("{}", messages_source(files, folder));
    // panic!("")
    messages_source(files, folder).parse().unwrap()
}

fn messages_source(files: Vec<SchemaFile>, folder: PathBuf) -> String {
    format!(
        "
        pub trait MessageBase {{
            const MESSAGE_ID: i64;
            fn plugin_id(&self) -> &str;
        }}

        #[derive(Serialize, Deserialize, Debug)]
        pub struct GenericMessage {{
            #[serde(rename = \"messageType\")]           
            message_type: i64
        }}

        #[derive(Debug)]
        pub struct Error {{
            message: String,
        }}

        impl std::fmt::Display for Error {{
            fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {{
                write!(f, \"Cannot parse Message: {{}}\", &self.message)
            }}
        }}

        schemafy::schemafy!(
            root: Definitions
            \"{definitions_path}\"
        );

        {schemafy}

        #[derive(Debug)]
        pub enum Message {{
            {message_enum}
        }}

        impl Message {{
            pub fn message_id(&self) -> i64 {{
                match self {{
                    {message_message_id}
                }}
            }}
            pub fn plugin_id(&self) -> &str {{
                match self {{
                    {message_plugin_id}
                }}
            }}
        }}
        
        impl std::str::FromStr for Message {{
            type Err = Error;

            fn from_str(s: &str) -> Result<Self, Self::Err> {{
                let msg: GenericMessage = serde_json::from_str(s)
                    .map_err(|e| 
                        Error {{ message: format!(\"Invalid message: {{}}\", e.to_string()).to_owned() }}
                    )?;
                let code = msg.message_type;
                match code {{
                    {message_from_str}
                    _ => Err(Error {{ message: \"Unknown message type\".to_owned() }}),
                }}
            }}
        }}

        impl serde::ser::Serialize for Message {{
            fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
            where
                S: serde::ser::Serializer,
            {{
                match self {{
                    {message_serialize}
                }}
            }}
        }}
        ",
        definitions_path = folder.join("definitions.json").display(),
        schemafy = schemafy_source(&files),
        message_enum = message_enum_source(&files),
        message_from_str = message_from_str_source(&files),
        message_plugin_id = message_plugin_id_source(&files),
        message_message_id = message_message_id_source(&files),
        message_serialize = message_serialize_source(&files),
    )
}

fn schemafy_source(files: &Vec<SchemaFile>) -> String {
    let mut source = "".to_owned();
    for file in files {
        source += &format!(
            "
            schemafy::schemafy!(
                root: {name}
                \"{path}\"
            );
            impl MessageBase for {name} {{
                const MESSAGE_ID: i64 = {id};
                fn plugin_id(&self) -> &str {{
                    &self.data.plugin_id
                }}
            }}
            impl Into<{name}> for {name}Data {{
                fn into(self) -> {} {{
                    {name} {{
                        data: self,
                        message_type: {name}::MESSAGE_ID,
                    }}
                }}
            }}
            impl Into<Message> for {name} {{
                fn into(self) -> Message {{
                    Message::{name}(self)
                }}
            }}
            impl Into<Message> for {name}Data {{
                fn into(self) -> Message {{
                    let msg: {name} = self.into();
                    msg.into()
                }}
            }}
            ",
            name = file.name(),
            path = file.path_str(),
            id = file.id(),
        );
    }
    source
}

fn message_enum_source(files: &Vec<SchemaFile>) -> String {
    let mut source = "".to_owned();
    for file in files {
        source += &format!(
            "
            {name}({name}),
            ",
            name = file.name(),
        );
    }
    source
}

fn message_from_str_source(files: &Vec<SchemaFile>) -> String {
    let mut source = "".to_owned();
    for file in files {
        source += &format!(
            "
            {name}::MESSAGE_ID => (
                Ok(Message::{name}(
                    serde_json::from_str(s).map_err(|e| 
                        Error {{ message: format!(\"Invalid JSON: {{}}\", e.to_string()).to_owned() }}
                    )?
                ))
            ),
            ",
            name = file.name(),
        );
    }
    source
}

fn message_plugin_id_source(files: &Vec<SchemaFile>) -> String {
    let mut source = "".to_owned();
    for file in files {
        source += &format!(
            "
            Message::{name}(msg) => msg.plugin_id(),
            ",
            name = file.name(),
        );
    }
    source
}

fn message_message_id_source(files: &Vec<SchemaFile>) -> String {
    let mut source = "".to_owned();
    for file in files {
        source += &format!(
            "
            Message::{name}(_) => {name}::MESSAGE_ID,
            ",
            name = file.name(),
        );
    }
    source
}

fn message_serialize_source(files: &Vec<SchemaFile>) -> String {
    let mut source = "".to_owned();
    for file in files {
        source += &format!(
            "
            Message::{name}(msg) => msg.serialize(serializer),
            ",
            name = file.name(),
        );
    }
    source
}
