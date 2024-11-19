# utils/dictionary

## subtree

### pull/push

```bash
# Push
git subtree push --prefix=src/utils/dictionary utils-dictionary master
# Pull
git subtree pull --prefix=src/utils/dictionary utils-dictionary master
# Force
git push utils-dictionary `git subtree split --prefix=src/utils/dictionary @`:master --force
```

test

### diff

```
git --no-pager diff utils-dictionary/master master:src/utils/dictionary
```

### Add to your project

1. Add a repository alias `git remote add utils-dictionary git@github.com:sashulinator/utils-dictionary.git`
2. To check a list of aliases `git remote -v`, you must see `utils-dictionary`
3. Check that your project has no changes
4. run `git subtree add --prefix=src/utils/dictionary utils-dictionary master`
