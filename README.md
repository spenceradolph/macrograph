# MacroGraph

## Running
You could run 'yarn dev' in the root directory, which will run the dev server for the UI, auto build the core, and start the electron process, but then you will have to kill the entire process if you want to restart the main process.

A better idea is to open three terminals and run 'yarn app dev', 'yarn core dev' and 'yarn electron dev' in them. This will run each build process independently, so you don't have to restart them each time. I'll probably make this easier eventually.

