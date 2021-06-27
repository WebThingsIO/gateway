extern crate proc_macro;

use std::{
    fs::{self, File},
    path::PathBuf,
};

use proc_macro::TokenStream;

use convert_case::{Case, Casing};
use serde_json::Value;

#[proc_macro]
pub fn declare_message_types(tokens: TokenStream) -> TokenStream {
    if !tokens.is_empty() {
        panic!("Macro expects no parameters");
    }

    let mut schemafy_code = SchemafyCode::new();
    let mut enum_code = EnumCode::new();
    let mut parse_code = ParseCode::new();

    let crate_root = PathBuf::from(std::env::var("CARGO_MANIFEST_DIR").unwrap());
    let crate_root = crate_root.parent().unwrap();
    let path = crate_root.join(PathBuf::from(
        "gateway_addon/gateway-addon-ipc-schema/messages",
    ));
    for path in fs::read_dir(path).unwrap() {
        let path = path.unwrap().path();
        let name = path
            .file_stem()
            .unwrap()
            .to_str()
            .unwrap()
            .to_case(Case::Pascal);
        schemafy_code.add(&path, &name);
        enum_code.add(&name);
        parse_code.add(&path, &name);
    }
    let source = format!(
        "{}\n{}\n{}\n",
        schemafy_code.result(),
        enum_code.result(),
        parse_code.result()
    );
    source.parse().unwrap()
}

struct SchemafyCode {
    source: String,
}

impl SchemafyCode {
    pub fn new() -> Self {
        Self {
            source: "".to_owned(),
        }
    }
    pub fn add(&mut self, path: &PathBuf, name: &str) {
        self.source += &format!(
            "schemafy::schemafy!(
                root: {}
                \"{}\"
            );\n",
            name,
            path.display().to_string()
        );
    }
    pub fn result(self) -> String {
        self.source
    }
}

struct EnumCode {
    source: String,
}

impl EnumCode {
    pub fn new() -> Self {
        Self {
            source: "".to_owned(),
        }
    }
    pub fn add(&mut self, name: &str) {
        self.source += &format!("{}({}),\n", name, name);
    }
    pub fn result(self) -> String {
        format!(
            "#[derive(Debug)]
            pub enum MessageType {{
                {}
            }}\n",
            self.source
        )
    }
}

struct ParseCode {
    source: String,
}

impl ParseCode {
    pub fn new() -> Self {
        Self {
            source: "".to_owned(),
        }
    }
    pub fn add(&mut self, path: &PathBuf, name: &str) {
        let schema: Value = serde_json::from_reader(
            File::open(path).expect(&format!("Open schema file {}", path.display())),
        )
        .expect(&format!("Parse JSON schema {}", path.display()));
        if let Some(properties) = schema
            .as_object()
            .expect("Schema root is object")
            .get("properties")
        {
            let code = properties
                .as_object()
                .expect("Schema properties is object")
                .get("messageType")
                .expect("Schema has messageType")
                .as_object()
                .expect("Schema messageType is object")
                .get("const")
                .expect("Schema messageType is const")
                .as_i64()
                .expect("Schema messageType is integer");

            self.source += &format!(
                "{} => (
                    Ok(MessageType::{}(
                        serde_json::from_str(s).map_err(|e| 
                            Error {{ message: format!(\"Invalid JSON: {{}}\", e.to_string()).to_owned() }}
                        )?
                    ))
                ),\n",
                code, name
            );
        }
    }
    pub fn result(self) -> String {
        format!(
            "#[derive(Serialize, Deserialize, Debug)]
            pub struct Message {{
                #[serde(rename = \"messageType\")]           
                message_type: i32
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
            
            impl std::str::FromStr for MessageType {{
                type Err = Error;

                fn from_str(s: &str) -> Result<Self, Self::Err> {{
                    let msg: Message = serde_json::from_str(s)
                        .map_err(|e| 
                            Error {{ message: format!(\"Invalid Message: {{}}\", e.to_string()).to_owned() }}
                        )?;
                    let code = msg.message_type;
                    match code {{
                        {}
                        _ => Err(Error {{ message: \"Unknown message type\".to_owned() }}),
                    }}
                }}
            }}\n",
            self.source
        )
    }
}
