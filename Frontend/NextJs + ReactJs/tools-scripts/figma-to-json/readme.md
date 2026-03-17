# Guidelines

In order to run this script you can:

```
sudo nano ~/scripts/figma_extractor.py
```

Then paste the code and save it.

To make the script globally accessible:

```
chmod +x ~/scripts/figma_extractor.py
sudo ln -s ~/scripts/figma_extractor.py /usr/local/bin/generate_figma_json
```

Now you can call

```
generate_figma_json <figma link>
```
