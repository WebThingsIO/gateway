#!/bin/bash -e

SCRIPTDIR=$(dirname ""$0"")

end(){
  # Return node_modules
  if [ -n "$DIFF" ]; then
    cd "${SCRIPTDIR}/../../" && npm install
  fi

  # Return current branch
  if [ -n "$CURRENT_BRANCH" ]; then
    git checkout ${CURRENT_BRANCH}
  fi
}
trap end SIGHUP SIGINT SIGKILL SIGTERM EXIT

# Move parent branch
CURRENT_BRANCH=$(git symbolic-ref --short HEAD)
PARENT_BRANCH=$(git show-branch | grep '*' | grep -v "$(git rev-parse --abbrev-ref HEAD)" | head -1 | awk -F'[]~^[]' '{print $2}')
git checkout ${PARENT_BRANCH}

# Check if should run npm
DIFF=$(git diff ${CURRENT_BRANCH} ${PARENT_BRANCH} package-lock.json)
if [ -n "$DIFF" ]; then
  cd "${SCRIPTDIR}/../../" && npm install
fi

# Cleanup the previous outputs
rm -rf "${SCRIPTDIR}/../../browser-test-screenshots"

# Run the browser tests
npm run test -- "${SCRIPTDIR}/browser"  -cwd "${SCRIPTDIR}/../../" 

# Move screenshots
mv "${SCRIPTDIR}/../../browser-test-output" "${SCRIPTDIR}/../../browser-test-screenshots"
