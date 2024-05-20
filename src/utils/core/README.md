# utils/core

## subtree

### pull/push

```bash
# Push
git subtree push --prefix=src/utils/core utils-core main
# Pull
git subtree pull --prefix=src/utils/core utils-core main
# Force
git push utils-core `git subtree split --prefix=src/utils/core @`:main --force
```

### Add to your project

1. Add a repository alias `git remote add utils-core git@gitlab.inno.tech:ts-modules/utils-core.git`
2. To check a list of aliases `git remote -v`, you must see `utils-core`
3. Check that your project has no changes
4. run `git subtree add --prefix=src/utils/core utils-core main`
