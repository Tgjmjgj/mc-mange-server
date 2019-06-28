workflow "GitHub Pages" {
  on = "push"
  resolves = ["Deploy to GitHub Pages"]
}

action "Filter master branch" {
  uses = "actions/bin/filter@3c0b4f0e63ea54ea5df2914b4fabf383368cd0da"
  args = "branch master"
}

action "Install Dependencies" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Filter master branch"]
  args = "install"
}

action "Build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Install Dependencies"]
  args = "run build"
}

action "Deploy to GitHub Pages" {
  uses = "maxheld83/ghpages@v0.2.1"
  needs = ["Build"]
  secrets = ["GH_PAT"]
  env = {
    BUILD_DIR = "deploy/"
  }
}
