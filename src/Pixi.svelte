<script>
  import * as PIXI from 'pixi.js';
  import {tick} from 'svelte';

  const pixiApp = new PIXI.Application({ width: 960, height: 720, transparent: true });

  const bodyContainer = new PIXI.Container();
  const partsContainer = new PIXI.Container();

  let pixiBlock; //div for canvas

  tick().then(()=> {
    pixiBlock.appendChild(pixiApp.view);
  })

  export let texturesFile;
  export let bodyStyle;
  export let bodyParts;
  export let percentage;
  export let tintColor;

  let texturesLoaded = false;
  let updated;

  $: update(bodyStyle, bodyParts, percentage, texturesLoaded);

  function update(bodyStyle, bodyParts, percentage, texturesLoaded) {
    if (texturesLoaded) {
      let curSprite = bodyContainer.children.find((el) => (el.name === bodyStyle));
      updatebodyStyle(bodyStyle, curSprite);
      updatebodyParts(bodyParts, percentage);
    }
  }

  function updatebodyStyle(bodyStyle, curSprite) {
    bodyContainer.children.forEach((el) => {
      el.alpha = 0;
    });
    curSprite.alpha = 1;
  }

  function updatebodyParts(bodyParts, percentage) {
    partsContainer.children.forEach((el) => {el.alpha = 0});
    let curSprites = partsContainer.children
      .filter((el) => {
        return el.name.includes(bodyStyle) && bodyParts.some( (elPart) => (el.name.includes(elPart)));
      });
    curSprites.forEach((el) => {
      el.alpha = 1.0 - percentage / 100;
      el.tint = tintColor;
    });
    // console.log('pixi: ', curSprites);
  }


  const loader = PIXI.Loader.shared;
  loader.add(texturesFile)
    .on("error", handlerLoadError)
    .load(handlerLoadComplete);

  function handlerLoadComplete() {
    let texturesList = loader.resources[texturesFile];
    Object.keys(texturesList.textures).forEach((el) => {
      let sprite = new PIXI.Sprite(texturesList.textures[el]);
      sprite.name = el;
      if (el.includes('_')) {
        sprite.tint = 0x000000;
        partsContainer.addChild(sprite);
      } else {
        bodyContainer.addChild(sprite);
      }
    });


    partsContainer.zIndex = 10;
    bodyContainer.alpha = 1;
    bodyContainer.zIndex = 1;
    pixiApp.stage.sortableChildren = true;
    pixiApp.stage.addChild(partsContainer);
    pixiApp.stage.addChild(bodyContainer);
    //pixiApp.stage.childern.sortChildren();
    texturesLoaded = true;
  }

  function handlerLoadError() {
    console.log("Error loading textures");
  }
</script>

<div class="canvas-wrapper" bind:this={pixiBlock}>
</div>