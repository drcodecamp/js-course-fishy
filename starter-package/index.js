// GAME SETTINGS
const maxEnemies = 40
const minEnemyType = 1
const maxEnemyType = 3
const bulletSpeed = 30
const minEnemyHp = 100
const maxEnemyHp = 750
const superPower = 250
const enemiesMinSpeed = 1
const enemiesMaxSpeed = 3
const reloadingTime = 500
const superPowerTime = 1200
const initialEnemiesCount = 5
const GAME_INTERVALS_SPEED = 10

// GAME DYNAMIC SETTINGS
let enemies = []
let globalEnemyIds = 1
let nextLevelExtraEnemies = 5
let bulletPower = 20
let isReloading = false
let isFiring = false
let isSuperPowersReady = true
let gameIsRunning = false
let bulletPool = []
let magazineSize = 35

// GAME INTERVALS
let enemiesInterval,
    bulletsInterval,
    collisionInterval,
    fireInterval,
    reloadingInterval

// GAME REFS
const hero = document.querySelector('.hero')
const enemiesContainer = document.querySelector('#enemies')
const bulletContainer = document.querySelector('#bullets')
const heroWidth = Number(getComputedStyle(hero).width.split('px')[0]) / 2
const heroHeight = Number(getComputedStyle(hero).height.split('px')[0]) / 2
const guns = document.querySelectorAll('.gun')
const gunsEffect = document.querySelectorAll('.effect')
const CHAR_SHOT_SPRITE = 'url("assets/hero_shoot.webp")'
const CHAR_IDLE_SPRITE = 'url("assets/hero_idle.webp")'

const fillMagazineWithBullets = () => {
    // build str for magazineUi
    // fill in the bulletPool with bullet objects
    // update the magazine UI
}

const instantiateEnemies = (nextEnemiesCount) => {
    // build str for enemyList
    // run a loop and create nextEnemies to be spawn
    // update enemies left text
}

const insertNewEnemy = () => {
    // generate initial position
    // generate random speed
    // push new enemy object
}

const generateSingleEnemyElement = (enemyIdx) => {
    // random some number to use as key to select random enemy
    // calculate the initial position OUT OF SCREEN
    // generate random height
    // switch statement maybe?
}

const updateEnemiesPosition = () => {
    // good place to check if all enemies are dead
    // if not update all enemies position
    // u probably want enemy to look like
    //     {
    //         id: ++globalEnemyIds,
    //         hp: generateRandomInt(minEnemyHp, maxEnemyHp),
    //         leftPosition,
    //         speed: randomSpd,
    //     }
}

const updateBulletsPosition = () => {
    // check if game is running?
    // function to update the bullets position on each frame
    // good place to decide what sprite to render if superpower is on
}

const resetBulletObjects = () => {
    // reset the bullet objects leftPostion and topPosition
}

const resetBulletsInitialPosition = () => {
    // reset all bullets ELEMENTS to their initial positions (out of screen to the left)
}

const useBullet = (bulletElement, bulletObj) => {
    // update single bullet to "used" mean when
    // can be consumed from other functions that may
    // trigger a collision
    // trigger that the bullet is out of screen
}

const generateRandomPosition = () => {
    // gen random pos base on screen width
}

const generateRandomEnemySpeed = () => {
    // generate random enemy speed
}

const generateRandomHeight = (enemyType) => {
    // generate random height
    // make sure that enemy "skeleton" are not floating in the sky
    // use argument enemyType
}

const updateCollisions = () => {
    // check if any bullet, is touching and enemy
    // then if so decrease enemy life and update bullet?
}

const reduceEnemyHp = (enemy, enemyIdx) => {
    // reduce enemy hp until his dead
}

const checkElementsCollision = (bulletSprite, enemySprite) => {
    // check two dom elements for collision
}

const setupHeroHandler = () => {
    // add event listener so hero will follow up and down of our mouse pos
    document.addEventListener('mousemove', (e) => {
        hero.style.top = e.clientY - heroHeight + 'px'
    })
}

// gen random integer
const generateRandomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const reloadMag = () => {
    // reload the magazine
    // do validations,
    // we can fire while loading? we
}

const updateReloading = () => {
    // check if ammo is empty and reload automatically
}

const updateHeroSpriteImage = (isShooting) => {
    // if shooting update character sprite and weapons
}

const keepFire = () => {
    // used in interval
    // here write logic to the firing mechanism
    // find the hero position
    // init new bullet base on this location
}

const onMouseClick = (e) => {
    // mouse click start firing
}

const onMouseUp = () => {
    // mouse release stop firing
}

const onKeyDown = (key) => {
    // make Space key to trigger superpower
}

const handleMouseDown = () => {}

const handleSuperPowerKey = () => {}

const toggleSuperPowerTitle = (showTitle) => {}

const removeEnemiesSprites = () => {
    // remove all enemies sprites
}

const gameOver = (isWon) => {
    // check if is game won or fail
    // reset settings
    // reset all intervals
    // update ui to show if win or lose
}

const prepareNextLevel = () => {
    // increment enemies for next level
    // stop all intervals
    // reset enemies and bullets
}

const incrementGameState = () => {
    // and validate other variables
}

const resetGameState = () => {
    // function that can be consumed from ? gameOver
}

const instantiateBullets = () => {
    // one time creation of the bullets
}

const toggleElementDisplay = (elementClass, selector = '') => {}

const clearGameIntervals = () => {}

const startGameIntervals = () => {}

const addControllerEvents = () => {
    document.body.addEventListener('mousedown', onMouseClick)
    document.body.addEventListener('mouseup', onMouseUp)
    document.body.addEventListener('keydown', onKeyDown)
}

const startGame = () => {
    setupHeroHandler()
    alert('Start coding! Good luck Have Fun!')
}
