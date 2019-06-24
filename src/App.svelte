<script>
  import { tick } from 'svelte';
  import Pixi from './Pixi.svelte';
  let isResolved = false;
  let prices = {};

  export let appTypeProp = 'tint';
  export let path = '';

  async function getPrices() {
    let result;
    await fetch(path+'prices.json')
      .then((res) => (res.json()))
      .then((res) => (result = res));
    isResolved = true;
    prices = result;
    return result;
  }
  getPrices();

  let type = 0;
  const selectApps = [
    {name: 'tint', description : 'Cтоимость тонировки'},
    {name: 'polish', description : 'Стоимость полировки'},
    {name: 'guard', description : 'Стоимость антигравийной защиты'}
  ];
  const tintColorArr = {
    'tint': 0x000000,
    'polish': 0xFF0000,
    'guard': 0x00FF00
  }

  const classedAuto = [
    'hatch',
    'sedan',
    'wagon'
  ];

  let appName;
  let filteredParts;
  let tintColor;

  const elementsUI = {
    bodyStyles: [
      { name: 'sedan', description: 'Седан' },
      { name: 'hatch', description: 'Хетчбек' },
      { name: 'wagon', description: ' Универсал' },
      { name: 'offroad', description: ' Внедорожник' },
      { name: 'van', description: ' Минивен' },
    ],
    bodyClasses: [
      { name: 'a', description: 'A' },
      { name: 'b', description: 'B' },
      { name: 'c', description: 'C' },
      { name: 'd', description: 'D' },
      { name: 'e', description: 'E' },
      { name: 'f', description: 'F' }
    ],
    bodyParts: [
      { type: 'tint', name: 'fdglass', description: 'Передние стекла' },
      { type: 'tint', name: 'fgstripe', description: 'Полоса на лобовом' },
      { type: 'tint', name: 'frontglass', description: 'Лобовое полностью' },
      { type: 'tint', name: 'rdglass', description: 'Задние стекла' },
      { type: 'tint', name: 'rearglass', description: 'Заднее стекло' },
      { type: 'tint', name: 'frontlamp', description: 'Фары' },
      { type: 'tint', name: 'rearlamp', description: 'Задние фонари' },
      { type: 'polish', name: 'reardoor', description: 'Задние двери' },
      { type: 'polish', name: 'frontdoor', description: 'Передние двери' },
      { type: 'polish', name: 'rearwing', description: 'Задние крылья' },
      { type: 'polish', name: 'frontwing', description: 'Передние крылья' },
      { type: 'polish', name: 'rearbumper', description: 'Задний бампер' },
      { type: 'polish', name: 'frontbumper', description: 'Передний бампер' },
      { type: 'polish', name: 'fhood', description: 'Капот' },
      { type: 'polish', name: 'frontlamp', description: 'Фары' },
      { type: 'polish', name: 'rearlamp', description: 'Задние фонари' },
      { type: 'polish', name: 'reargate', description: 'Крышка багажника' },
      { type: 'guard', name: 'reardoor', description: 'Задние двери' },
      { type: 'guard', name: 'frontdoor', description: 'Передние двери' },
      { type: 'guard', name: 'rearwing', description: 'Задние крылья' },
      { type: 'guard', name: 'frontwing', description: 'Передние крылья' },
      { type: 'guard', name: 'rearbumper', description: 'Задний бампер' },
      { type: 'guard', name: 'frontbumper', description: 'Передний бампер' },
      { type: 'guard', name: 'fhood', description: 'Капот' },
      { type: 'guard', name: 'doorstep', description: 'Пороги' },
      { type: 'guard', name: 'roof', description: 'Крыша' },
      { type: 'guard', name: 'stand', description: 'Стойки' },
      { type: 'guard', name: 'hoodstripe', description: 'Полоса капота' },
      { type: 'guard', name: 'arch', description: 'Арки' },
      { type: 'guard', name: 'mirror', description: 'Зеркала' },
      { type: 'guard', name: 'loading', description: 'Погрузочная зона' },
      { type: 'guard', name: 'handle', description: 'Ручки дверей' },
    ],
    filmBrands: [
      'Llumar',
      'Luxman',
      'Korea'
    ],
    percentages: ['15', '20', '35', '0.5', '93', '70'],
  }

  let selected = {
    appType: appTypeProp,
    oldApp: '',
    bodyStyle: elementsUI.bodyStyles[0].name,
    oldBodyStyle: '',
    bodyClass: '',
    bodyParts: [],
    film: elementsUI.filmBrands[0] + '_' + elementsUI.percentages[0],
  }
  let filmBrand = elementsUI.filmBrands[0];
  let percentage = elementsUI.percentages[0];

  let price = 0;
  let curprice = '';

  async function updatePrice () {
    let priceArr = selected.bodyParts
      .map((el) => (curprice[el]))
      .filter((e) => (Number.isInteger(Number(e))));
    price = priceArr.reduce((acc, el) => (acc += Number(el)), 0);
  }

  async function updateFilm (film) {
    filmBrand = film.split('_')[0];
    percentage = film.split('_')[1];
    if (isResolved) {
      if(selected.appType === 'tint') {
        curprice = prices[selected.bodyStyle][filmBrand];
      } else {
        curprice = prices[selected.bodyStyle][selected.appType];
      }
    }
    await tick();
    updatePrice();
  }

  async function appChanged() {
    selected.bodyParts = [];
    selected.bodyStyle = elementsUI.bodyStyles[0].name;
    selected.bodyClass = '';
    selected.film = elementsUI.filmBrands[0] + '_' + elementsUI.percentages[0];
    if(selected.appType !== 'tint') {
      percentage = 0;
    }
    tintColor = tintColorArr[selected.appType];
    selected.oldApp = selected.appType;
    price = 0
    await tick();
    updateFilm(selected.film);
  }

  async function bodyChanged() {
    selected.bodyParts = [];
    selected.film = elementsUI.filmBrands[0] + '_' + elementsUI.percentages[0];
    selected.oldBodyStyle = selected.bodyStyle;
  }

  $: updateFilm(selected.film, isResolved);
  $: updatePrice(selected);
  $: appName = selectApps.find((e) => (e.name === selected.appType)).description;
  $: filteredParts = elementsUI.bodyParts.filter((e) => (e.type === selected.appType))
    .map((e) => ({...e, disabled: (!curprice) ? true : curprice[e.name] === 'x'}));
  $: if(selected.appType !== selected.oldApp) appChanged();
  $: if(selected.bodyStyle !== selected.oldBodyStyle) bodyChanged();


</script>

<div class="app-wrapper">
  <h1>{appName}</h1>

  <div class="elements-wrapper">
    <div class="bodystyles-wrapper">
      {#each elementsUI.bodyStyles as bodyStyle}
        <input id={bodyStyle.name}  type="radio" name="body-style" value={bodyStyle.name} bind:group={selected.bodyStyle} />
        <label for={bodyStyle.name} >
          <img src='{path}img/{bodyStyle.name}.png' alt={bodyStyle.description} />
        </label>
      {/each}
    </div>

    {#if (classedAuto.includes(selected.bodyStyle))}
      <div class="bodyclass-wrapper">
        {#each elementsUI.bodyClasses as bodyClass}
          <input id={bodyClass.name} type="radio" name="body-class" value={bodyClass.name} bind:group={selected.bodyClass} />
          <label class="label" for={bodyClass.name}>
            {bodyClass.description} класс
          </label>
        {/each}
      </div>
    {/if}

    <div class="bodyparts-wrapper">
      {#each filteredParts as bodyPart}
        <input id={bodyPart.name} type="checkbox" name="body-parts" value={bodyPart.name} bind:group={selected.bodyParts} disabled={bodyPart.disabled}/>
        <label class="label" for={bodyPart.name} class:disabled={bodyPart.disabled}>
          {bodyPart.description}
        </label>
      {/each}
    </div>

    {#if selected.appType === 'tint'}
      <div class="tints-wrapper">
        {#each elementsUI.filmBrands as filmBrand}
          <div class="view__list d-flex">
            <div class="view__item">
              <div class="view__title">
                {filmBrand}
              </div>
            </div>
          {#each elementsUI.percentages  as percentage, index}
            <label class="view__section{index+1}">
              <input type="radio" name="selected-percentage" value={filmBrand+'_'+percentage} bind:group={selected.film} />
              <p class="view__text">
                {percentage}%
              </p>
            </label>
          {/each}
          </div>
        {/each}
      </div>
    {/if}

    </div>

  <div class="price-wrapper">
    <p>Цена: {price}</p>
  </div>

  <Pixi
    bodyStyle={selected.bodyStyle}
    bodyParts={selected.bodyParts.filter(e => !(filteredParts.find((el) => (el.name === e)).disabled))}
    percentage={percentage}
    tintColor={tintColor}
    texturesFile={path+'textures/cars.json'}
  />
</div>
