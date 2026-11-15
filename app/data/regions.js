// The six regions (plus the creek) on the 3D world map.
// `at` is [x, height, z] in game-world coordinates; the map converts it.

/**
 * @typedef {Object} Region
 * @property {string} id
 * @property {string} name
 * @property {string} dir   Compass hint shown above the name
 * @property {[number,number,number]} at
 * @property {string} desc
 * @property {string[]} list
 */

/** @type {Region[]} */
export const REGIONS=[
    {id:'farm',name:'The Farm',dir:'West · Start here',at:[-48,3,-2],desc:'Home sweet farm. Your animals live in the barn, the quest board stands by the well, and your crops grow in the field.',list:['Barn with pens for your animal friends','Quest board, crops and the Blacksmith','Gates and spikes hold back the night']},
    {id:'meadow',name:'Meadow',dir:'Centre',at:[8,2,-25],desc:'Tall grass and wildflowers. Bunnies love it here.',list:['Bunnies all day','Gray wolves roam after dark']},
    {id:'grove',name:'Old Oak Grove',dir:'East',at:[57,5,-19],desc:'Big old oaks. Squirrels by day, owls by night.',list:['Squirrels and owls','Oak trees drop acorns','Mushroom rings in the shade']},
    {id:'ridge',name:'Pine Ridge',dir:'North',at:[10,15,-66],desc:'Tall pines and cold air. Squirrels forage up here, and wolves like it too.',list:['Squirrels','Wolf packs and the Alpha Wolf','Oaks hidden among the pines']},
    {id:'fields',name:'Sunflower Fields',dir:'South · Across the creek',at:[5,2,62],desc:'Sunflowers as far as you can see. Bunnies and fawns wander here.',list:['Bunnies and fawns','Spirit Fawn in the rain','Wild boars at night']},
    {id:'marsh',name:'Misty Marsh',dir:'Far east',at:[97,2,20],desc:'Reeds and still ponds. Mushrooms grow in the damp.',list:['Frogs in the ponds','Mud Boars in the muck','A hidden mushroom ring']},
    {id:'creek',name:'The Creek',dir:'Runs from the spring to the marsh',at:[30,1,40],desc:'The creek burbles. Frogs come out when it rains.',list:['Starts at a spring by the farm','Splits the meadow from the sunflowers']}];
