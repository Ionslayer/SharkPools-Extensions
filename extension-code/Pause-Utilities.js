// Name: Pause Utilities
// ID: SPPause
// Description: Pause the Project and certain Scripts
// By: SharkPool

// Version V.1.6.2

(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) alert("Pause Utilities Extension must run unsandboxed!");
  const vm = Scratch.vm;
  const runtime = Scratch.vm.runtime;
  const Cast = Scratch.Cast;
  let storedScripts = {};
  let projectPaused = false;

  const menuIconURI =
"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTgiIHdpZHRoPSIxOCI+PHBhdGggZD0iTTIzMS40MjkgMTg4LjkyOVYxNzEuMDdoNC4yODV2MTcuODU4em0xMi4xNDIgMFYxNzEuMDdoNC4yODZ2MTcuODU4eiIgdHJhbnNmb3JtPSJtYXRyaXgoMS4wMzMwOSAwIDAgLjk1NDI3IC0yMzguNTczIC0xNjIuNzY5KSIgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aXNQYWludGluZ0xheWVyJnF1b3Q7OnRydWV9IiBmaWxsPSIjZmZhZTAwIiBzdHJva2U9IiNkODk0MDAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOm5vcm1hbCIvPjwvc3ZnPg==";

  const blockIconURI =
"data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIzMS40NzcxNCIgaGVpZ2h0PSIzMS40NzcxNCIgdmlld0JveD0iMCwwLDMxLjQ3NzE0LDMxLjQ3NzE0Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjI0LjI2MTQzLC0xNjQuMjYxNDMpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0yMjQuMjYxNDMsMTk1LjczODU3di0zMS40NzcxNGgzMS40NzcxNHYzMS40NzcxNHoiIGZpbGw9IiM1ZjViNDkiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTIzMS41MjgxOSwxODguNDk5MTN2LTE3LjA0MjMxaDQuNDI2Nzl2MTcuMDQxMzV6TTI0NC4wNzE5NiwxODguNDk5MTN2LTE3LjA0MjMxaDQuNDI3ODJ2MTcuMDQxMzV6IiBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGw9IiNmZmFlMDAiIHN0cm9rZT0iI2Q4OTQwMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9nPjwvZz48L3N2Zz4=";

  runtime.on("PROJECT_STOP_ALL", () => { storedScripts = {} });

  function beginScan() {
    let isChecking = false;
    const check = () => {
      if (isChecking) return;
      const isPM = Scratch.extensions.isPenguinMod;
      isChecking = true;
      try {
        projectPaused = runtime.ioDevices.clock._paused;
        if (!projectPaused && !isPM) return;
        const allUtils = vm.runtime.targets;
        for (let i = 0; i < allUtils.length; i++) {
          const util = allUtils[i];
          const object = util.blocks._blocks;
          const keysV = getKeysByValue(object, "opcode", "SPPause_whenProjectPaused");
          for (const keyV of keysV) {
            if (runtime.threads) {
              let threadExists = runtime.threads.some(thread => thread.topBlock === object[keyV].id);
              if (!threadExists) {
                if (projectPaused) {
                  vm.runtime._pushThread(object[keyV].id, util);
                  checkReset(object[keyV].id);
                } else if (isPM) { checkReset(object[keyV].id) }
              } else { checkReset(object[keyV].id) }
            }
          }
        }
        if (isPM && projectPaused) vm.runtime._step();
      } catch {} finally {
        isChecking = false;
        setTimeout(check, 10);
      }
    };
    check();
  }
  function getKeysByValue(object, name, value) {
    const keys = [];
    for (const key in object) {
      if (object[key][name] === value) keys.push(key);
    }
    return keys;
  }
  function checkReset(ID) {
    const threadExists = runtime.threads.find(thread => thread.topBlock === ID);
    if (threadExists.status === undefined) threadExists.status = 4;
  }

  class SPPause {
    getInfo() {
      return {
        id: "SPPause",
        name: "Pause Utilities",
        color1: "#5f5b49",
        menuIconURI,
        blockIconURI,
        blocks: [
          { blockType: Scratch.BlockType.LABEL, text: "Project Control" },
          {
            opcode: "pause",
            blockType: Scratch.BlockType.COMMAND,
            text: "pause project"
          },
          {
            opcode: "unpause",
            blockType: Scratch.BlockType.COMMAND,
            text: "unpause project"
          },
          {
            opcode: "whenProjectPaused",
            blockType: Scratch.BlockType.EVENT,
            text: "when project is paused",
            isEdgeActivated: false
          },
          {
            opcode: "isProjectPaused",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "is project paused?"
          },
          { blockType: Scratch.BlockType.LABEL, text: "Sprite Control" },
          {
            opcode: "pauseSprite",
            blockType: Scratch.BlockType.COMMAND,
            text: "pause [SPRITE]",
            arguments: {
              SPRITE: {
                type: Scratch.ArgumentType.STRING,
                menu: "TARGETS"
              }
            }
          },
          {
            opcode: "unpauseSprite",
            blockType: Scratch.BlockType.COMMAND,
            text: "unpause [SPRITE]",
            arguments: {
              SPRITE: {
                type: Scratch.ArgumentType.STRING,
                menu: "TARGETS"
              }
            }
          },
          "---",
          {
            opcode: "pauseClones",
            blockType: Scratch.BlockType.COMMAND,
            text: "pause clones of [SPRITE] with [VAR] set to [NUM]",
            arguments: {
              SPRITE: {
                type: Scratch.ArgumentType.STRING,
                menu: "TARGETS2"
              },
              VAR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my variable"
              },
              NUM: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: "unpauseClones",
            blockType: Scratch.BlockType.COMMAND,
            text: "unpause clones of [SPRITE] with [VAR] set to [NUM]",
            arguments: {
              SPRITE: {
                type: Scratch.ArgumentType.STRING,
                menu: "TARGETS2"
              },
              VAR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my variable"
              },
              NUM: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          { blockType: Scratch.BlockType.LABEL, text: "Script Control" },
          {
            opcode: "pauseLoop",
            blockType: Scratch.BlockType.COMMAND,
            text: "pause this script with ID [NAME]",
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my script"
              }
            }
          },
          {
            opcode: "breakLoop",
            blockType: Scratch.BlockType.COMMAND,
            text: "unpause script with ID [NAME]",
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my script"
              }
            }
          },
          {
            opcode: "breakAll",
            blockType: Scratch.BlockType.COMMAND,
            text: "unpause all scripts"
          },
          "---",
          {
            opcode: "pauseLoopCon",
            blockType: Scratch.BlockType.COMMAND,
            text: "if [CON] pause this script with ID [NAME]",
            arguments: {
              CON: { type: Scratch.ArgumentType.BOOLEAN },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my script"
              }
            }
          },
          {
            opcode: "breakLoopCon",
            blockType: Scratch.BlockType.COMMAND,
            text: "if [CON] unpause script with ID [NAME]",
            arguments: {
              CON: { type: Scratch.ArgumentType.BOOLEAN },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my script"
              }
            }
          },
          "---",
          {
            opcode: "isPaused",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "is script with ID [NAME] paused?",
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my script"
              }
            }
          },
          {
            opcode: "allPausedScripts",
            blockType: Scratch.BlockType.REPORTER,
            text: "all paused scripts",
            disableMonitor: true
          },
        ],
        menus: {
          TARGETS: { acceptReporters: true, items: this._getTargets(0) },
          TARGETS2: { acceptReporters: true, items: this._getTargets(1) }
        }
      };
    }

    _getTargets(ind) {
      const spriteNames = [];
      const targets = Scratch.vm.runtime.targets;
      for (let index = ind; index < targets.length; index++) {
        const target = targets[index];
        if (target.isOriginal) spriteNames.push(target.getName());
      }
      return spriteNames.length > 0 ? spriteNames : [""];
    }

    pause() {
      if (Scratch.extensions.isPenguinMod) {
        runtime.pause();
      } else {
        const pauseButton = document.querySelector(
          runtime.isPackaged ? `[class*="pause-button"]` :
          "img.pause-btn.addons-display-none-pause"
        );
        if (pauseButton) {
          pauseButton.click();
        } else { console.log("Pause button not found") }
      }
    }

    unpause() {
      if (Scratch.extensions.isPenguinMod) {
        runtime.play()
      } else {
        this.pause();
      }
    }

    // by itself, the block is useless, but with the event block it is :D
    isProjectPaused() { return projectPaused }

    pauseSprite(args) {
      const target = args.SPRITE === "Stage" ? runtime.getTargetForStage() : runtime.getSpriteTargetByName(args.SPRITE);
      if (target) this.searchThreads(target.id, 1);
    }
    unpauseSprite(args) {
      const target = args.SPRITE === "Stage" ? runtime.getTargetForStage() : runtime.getSpriteTargetByName(args.SPRITE);
      if (target) this.searchThreads(target.id, 0);
    }
    pauseClones(args) { this.modifyClones.call(this, args, 1) }
    unpauseClones(args) { this.modifyClones.call(this, args, 0) }

    searchThreads(target, cntrl) {
      const thread = runtime.threads;
      thread.forEach(t => {
        if (t.target.id === target && t.status !== cntrl) t.status = cntrl;
      });
    }
    modifyClones(args, cntrl) {
      const target = runtime.getSpriteTargetByName(args.SPRITE);
      if (target) {
        const clones = target.sprite.clones;
        const varName = args.VAR;
        const numValue = args.NUM;
        for (let i = 1; i < clones.length; i++) {
          const variable = clones[i].lookupVariableByNameAndType(varName, "");
          if (variable && variable.value === numValue) this.searchThreads(clones[i].id, cntrl);
        }
      }
    }

    pauseLoopCon(args, util) { if (Cast.toBoolean(args.CON)) this.pauseLoop(args, util) }

    breakLoopCon(args) { if (Cast.toBoolean(args.CON)) this.breakLoop(args) }

    pauseLoop(args, util) {
      const scriptName = Cast.toString(args.NAME);
      const state = util.stackFrame.pausedScript;
      if (!state) {
        storedScripts[scriptName] = true;
        util.stackFrame.pausedScript = scriptName;
        util.yield();
      } else if (state in storedScripts) {
        util.yield();
      }
    }

    breakLoop(args) {
      const scriptName = Cast.toString(args.NAME);
      if (scriptName in storedScripts) delete storedScripts[scriptName];
    }

    breakAll() {
      const allScripts = Object.keys(storedScripts);
      for (let i = 0; i < allScripts.length; i++) {
        this.breakLoop({ NAME : allScripts[i] });
      }
    }

    isPaused(args) {
      const scriptName = Cast.toString(args.NAME);
      return scriptName in storedScripts;
    }

    allPausedScripts() { return JSON.stringify(Object.keys(storedScripts)) }
  }

  beginScan()
  Scratch.extensions.register(new SPPause());
})(Scratch);
