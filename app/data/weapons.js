// Weapon tiers, forge costs and ratings, straight from the game's numbers.

/**
 * @typedef {'knife'|'sling'} WeaponKind
 * @typedef {Object} WeaponLine
 * @property {string[]} names
 * @property {number[]} dmg   Damage bonus per tier
 * @property {number[]} cd    Seconds between attacks per tier
 * @property {number[]} [rng] Knife reach in metres
 * @property {number[]} [spd] Sling shot speed
 * @property {number[]} cost  Coins to forge
 * @property {(Record<string,number>|null)[]} mats Enemy drops to forge
 * @property {number[]} [col] Blade colour per tier
 */

/** @type {Record<WeaponKind,WeaponLine>} */
export const WPN={knife:{names:['Rusty knife','Iron knife','Steel dagger',"Hunter's blade",'Moonsteel blade'],dmg:[0,.5,1,1.6,2.4],cd:[.5,.45,.4,.36,.32],rng:[3.2,3.4,3.6,3.9,4.2],cost:[0,60,150,320,600],mats:[null,{fur:3},{tusk:3,fur:2},{claw:2,fang:1},{core:1,fang:1,claw:3}],col:[0x8a7462,0xc9d0d8,0xe6ecf2,0x8fd0ea,0xb9a6ff]},
  sling:{names:['Twig sling','Leather sling',"Hunter's sling",'Iron sling','Thunder sling'],dmg:[0,.5,1,1.5,2.2],cd:[.75,.68,.6,.52,.45],spd:[28,30,32,35,38],cost:[0,50,130,280,520],mats:[null,{fur:3},{tusk:3},{claw:2,crown:1},{core:1,crown:1,claw:3}]}};

/** Display names for forge materials. */
export const MATN={fur:'wolf fur',tusk:'boar tusk',claw:'burrow claw',fang:'Alpha fang',crown:'royal tusk',core:'Earth core'};

/**
 * @param {WeaponKind} w
 * @param {number} t tier index (0 to 4)
 * @returns {string}
 */
export function forgeCost(w,t){if(!t)return 'Starter weapon';const m=WPN[w].mats[t];return WPN[w].cost[t]+' coins + '+Object.entries(m).map(([k,v])=>v+'× '+MATN[k]).join(', ');}

/**
 * Damage, speed and range on a 1 to 5 scale, for the bars in the field guide.
 * @param {WeaponKind} w
 * @param {number} t
 * @returns {{Damage:number,Speed:number,Range:number}}
 */
export function wRate(w,t){const W=WPN[w];return {Damage:1+Math.round(W.dmg[t]/2.4*4),Speed:1+Math.round((.75-W.cd[t])/(.75-.32)*4),Range:w==='knife'?(t>=3?2:1):5};}

/**
 * The stat rows for a weapon in the field guide.
 * @param {WeaponKind} w
 * @param {number} t
 * @returns {[string,string][]}
 */
export const wStats=(w,t)=>{const W=WPN[w];return [['Type',w==='knife'?'Melee':'Ranged'],['Key',w==='knife'?'F':'G'],['Damage bonus','+'+W.dmg[t]],['Attacks every',W.cd[t]+'s'],[w==='knife'?'Reach':'Shot speed',w==='knife'?W.rng[t]+' m':String(W.spd[t])],['Forge cost',forgeCost(w,t)]];};
