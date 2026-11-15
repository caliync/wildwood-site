// The field guide: every weapon, animal and building shown in the 3D viewer.
// `model` and `variant` pick the builder in lib/three/models.js; the rest is
// copy for the info panel.
import {wStats} from './weapons.js'

/**
 * @typedef {'weapons'|'animals'|'structures'} Category
 * @typedef {Object} CatalogItem
 * @property {string} name
 * @property {string} tag      Shown as the pill above the name
 * @property {string} model    Key into MODELS
 * @property {*} [variant]     Extra argument for the builder (tier, colour variant)
 * @property {string} desc
 * @property {[string,string][]} stats
 */

/** @type {Category[]} */
export const CATEGORIES=['weapons','animals','structures']

/** @type {Record<Category,CatalogItem[]>} */
export const CATALOG={
  weapons:[
    {name:'Rusty knife',tag:'Tier 1',model:'knife',variant:0,desc:'Your first weapon. Swing at a wolf or boar right next to you. Quick, but the reach is short.',stats:wStats('knife',0)},
    {name:'Steel dagger',tag:'Tier 3',model:'knife',variant:2,desc:'The third knife at the Blacksmith. Faster swings and a longer reach than the iron knife.',stats:wStats('knife',2)},
    {name:'Moonsteel blade',tag:'Tier 5',model:'knife',variant:4,desc:'The best knife in the game. Forging it takes an Earth core from the Ancient Burrow King.',stats:wStats('knife',4)},
    {name:'Twig sling',tag:'Tier 1',model:'sling',variant:0,desc:'Fire a pebble at the nearest wolf or boar, even from far away. Your starting ranged weapon.',stats:wStats('sling',0)},
    {name:'Iron sling',tag:'Tier 4',model:'sling',variant:3,desc:'An iron frame for faster, harder shots. Forging it needs a royal tusk from the Boar King.',stats:wStats('sling',3)},
    {name:'Thunder sling',tag:'Tier 5',model:'sling',variant:4,desc:'The top sling, with bands that crackle with light. Needs an Earth core and a royal tusk.',stats:wStats('sling',4)}],
  animals:[
    {name:'Bunny',tag:'Tameable',model:'bunny',desc:'Trust fills fast, so it makes a perfect first friend. Its pen in the barn is free.',stats:[['Found','Daytime in the meadow or sunflower fields'],['Favourite food','Carrot'],['Temper','Curious'],['Gift','Clover']]},
    {name:'Squirrel',tag:'Tameable',model:'squirrel',desc:'Any step scares it, so don’t move at all while its heart fills.',stats:[['Found','Daylight in the oak grove or Pine Ridge'],['Favourite food','Acorn'],['Temper','Jittery'],['Gift','Pine cone']]},
    {name:'Frog',tag:'Tameable',model:'frog',desc:'Slow to trust, but it never runs away. You can only find it in the rain.',stats:[['Found','By the creek, only in the rain'],['Favourite food','Bug snack'],['Temper','Lazy'],['Gift','Lily flower']]},
    {name:'Fawn',tag:'Tameable',model:'fawn',variant:false,desc:'Crouch the whole time or it gets nervous and bolts.',stats:[['Found','Dawn and dusk in the meadow or fields'],['Favourite food','Wild berries'],['Temper','Shy'],['Gift','Soft moss']]},
    {name:'Owl',tag:'Tameable',model:'owl',desc:'It only trusts someone who already has 3 animal friends.',stats:[['Found','Night, on stumps in the grove or ridge'],['Favourite food','Mushroom'],['Temper','Proud'],['Gift','Feather']]},
    {name:'Spirit Fawn',tag:'Legendary',model:'fawn',variant:true,desc:'A glowing ghost fawn that appears in some rain. Harder to tame, with its own pen in the barn.',stats:[['Appears','In the rain'],['Bonus','100 XP'],['Gift','Spirit dew (40 coins)']]},
    {name:'Gray Wolf',tag:'Hostile',model:'wolf',variant:'gray',desc:'Packs march on your farm in waves every night. When one crouches, it’s about to pounce.',stats:[['Found','Night raids, and ambushes on the way home'],['Drops','Wolf fur']]},
    {name:'Wild Boar',tag:'Hostile',model:'boar',variant:'wild',desc:'Roams by day and charges without warning.',stats:[['Found','Daytime, out in the wild'],['Drops','Boar tusk']]},
    {name:'Mud Boar',tag:'Weather',model:'boar',variant:'mud',desc:'Rain brings Mud Boars out of the woods. Tougher than a wild boar.',stats:[['Appears','In the rain'],['Health','6'],['Drops','2 boar tusks']]},
    {name:'Ghost Wolf',tag:'Weather',model:'wolf',variant:'ghost',desc:'Pale wolves that drift out of the fog, up to three at a time.',stats:[['Appears','In fog'],['Health','5'],['Drops','2 wolf furs']]},
    {name:'Storm Wolf',tag:'Weather',model:'wolf',variant:'storm',desc:'Big crackling wolves that hunt during thunderstorms.',stats:[['Appears','In storms'],['Health','10'],['Drops','2 wolf furs, 1 burrow claw']]},
    {name:'Alpha Wolf',tag:'Boss',model:'wolf',variant:'alpha',desc:'Leads the pack on full-moon nights. Huge, dark and red-eyed, it hits for two hearts.',stats:[['Appears','Full-moon nights'],['Drops','Alpha fang, 3 wolf furs'],['Reward','150 XP']]},
    {name:'Boar King',tag:'Boss',model:'boar',variant:'king',desc:'A giant spiked boar with a crown of gold that can show up during the day.',stats:[['Appears','Daytime'],['Drops','Royal tusk, 3 boar tusks'],['Reward','150 XP']]},
    {name:'Ancient Burrow King',tag:'Boss',model:'digger',variant:3,desc:'Taming a rare animal can wake a Burrow boss that digs out of the ground to take it back. The Brute and Warlord come first. The King is the strongest.',stats:[['Burrow bosses','Brute, Warlord, King'],['Health','9 / 14 / 22'],['Drops','Burrow claws, Earth core from the King'],['Reward','Up to 260 XP']]}],
  structures:[
    {name:'Red Barn',tag:'Your farm',model:'barn',desc:'Every animal you befriend lives here. Each species has its own pen, and you can upgrade a pen up to level 5 so it holds more and gifts come faster.',stats:[['Pens','Bunny, squirrel, frog, fawn, owl, Spirit Fawn'],['Pen levels','Up to 5'],['Care','Pet or feed each animal up to 3 times a day']]},
    {name:'Crop Plots',tag:'Your farm',model:'crops',desc:'Plant carrots, berries, mushrooms and pumpkins. Grow the food an animal loves before you try to befriend it.',stats:[['Crops','Carrots, berries, mushrooms, pumpkins'],['Favourite foods','Carrots for bunnies, berries for fawns, mushrooms for owls']]},
    {name:'Camp Tent',tag:'Home 1',model:'tent',desc:'Where you start. Your home levels up from tent to log cabin, farmhouse and manor.',stats:[]},
    {name:'Log Cabin',tag:'Home 2',model:'cabin',desc:'The first home upgrade. Later you can build a farmhouse (400 coins) and a manor (900 coins).',stats:[['Cost','150 coins'],['Perks','+1 max heart, hearts refill twice as fast on your farm']]},
    {name:'Stone Well',tag:'Your farm',model:'well',desc:'The heart of the farm. Daily quests are pinned on the board beside it.',stats:[]},
    {name:'Blacksmith',tag:'Your farm',model:'forge',desc:'Forge stronger weapons with coins and enemy drops. Your Strength skill adds damage on top.',stats:[]},
    {name:'Gates & Spikes',tag:'Defence',model:'gates',desc:'Raiders must break your gates before they get in. Spike traps hurt every raider that walks up to a gate.',stats:[]},
    {name:'Watchtower',tag:'Defence',model:'tower',desc:'Shoots at enemies near the farm. Upgrade it to an archer tower, then twin towers.',stats:[['Levels','Watchtower, Archer tower, Twin towers'],['Damage','1 every 2.6s, up to 1.5 every 1.6s'],['Cost','120, 260 and 480 coins']]}]
};
