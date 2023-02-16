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
    let magazineUi = ''
    for (let i = 0; i <= magazineSize; i++) {
        bulletPool[i] = {
            id: i,
            isIdle: true,
            isUsed: false,
            topPosition: 0,
            leftPosition: 0,
            speed: bulletSpeed,
        }
        magazineUi += `<div data-ammo="${i}" class="ammo"><span></span></div>`
    }
    document.querySelector('.magazine-container').innerHTML = magazineUi
}

const instantiateEnemies = (nextEnemiesCount) => {
    let enemyList = ''
    for (let i = 0; i <= nextEnemiesCount; i++) {
        insertNewEnemy()
        const singleEnemyElement = generateSingleEnemyElement(i)
        enemyList += singleEnemyElement
    }
    enemiesContainer.innerHTML = enemyList
    document.querySelector(
        '.enemies-count'
    ).innerHTML = `Enemies Left ${enemies.length}`
}

const insertNewEnemy = () => {
    let initialPosition = generateRandomPosition()
    let randomSpd = generateRandomEnemySpeed()
    enemies.push({
        id: ++globalEnemyIds,
        hp: generateRandomInt(minEnemyHp, maxEnemyHp),
        leftPosition: initialPosition,
        speed: randomSpd,
    })
}

const generateSingleEnemyElement = (enemyIdx) => {
    const enemyType = generateRandomInt(minEnemyType, maxEnemyType)
    const windowWidth = window.innerWidth
    const randomHeight = generateRandomHeight(enemyType)
    switch (enemyType) {
        case 1:
            return `<div data-enemy="${enemies[enemyIdx].id}" class="enemy-a" style="left:${windowWidth}px;bottom:${randomHeight}px;" ></div>`
        case 2:
            return `<div data-enemy="${enemies[enemyIdx].id}" class="enemy-b" style="left:${windowWidth}px;bottom:${randomHeight}px;" ></div>`
        case 3:
            return `<div data-enemy="${enemies[enemyIdx].id}" class="enemy-c" style="left:${windowWidth}px;bottom:${randomHeight}px;" ></div>`
        default:
            return `<div></div>`
    }
}

const updateEnemiesPosition = () => {
    if (enemies.length <= 0) {
        return prepareNextLevel()
    }
    enemies.forEach((enemy) => {
        const enemyElement = document.querySelector(
            `[data-enemy="${enemy.id}"]`
        )
        if (!enemyElement) return
        enemy.leftPosition -= enemy.speed
        enemyElement.style.left = enemy.leftPosition + 'px'
        if (enemy.leftPosition <= hero.getBoundingClientRect().x) {
            return gameOver()
        }
    })
}

const resetBulletsInitialPosition = () => {
    bulletPool.forEach((bullet) => {
        const bulletElement = document.querySelector(
            `[data-bullet="${bullet.id}"]`
        )
        bulletElement.style.left = '-100px'
        bulletElement.style.top = '-100px'
    })
}

const updateBulletsPosition = () => {
    if (gameIsRunning) {
        bulletPool.forEach((bullet) => {
            if (!bullet.isIdle) {
                const ammoElement = document.querySelector(
                    `[data-ammo="${bullet.id}"]`
                )
                const bulletElement = document.querySelector(
                    `[data-bullet="${bullet.id}"]`
                )
                ammoElement.style.opacity = '0.1'
                bullet.leftPosition += bulletSpeed
                bulletElement.style.left = bullet.leftPosition + 'px'
                bulletElement.style.top = bullet.topPosition + 'px'
                if (bullet.leftPosition > window.innerWidth) {
                    useBullet(bulletElement, bullet)
                }
                if (!isSuperPowersReady) {
                    bulletElement.classList.remove('bullet')
                    bulletElement.classList.add('super-bullet')
                } else {
                    bulletElement.classList.remove('super-bullet')
                    bulletElement.classList.add('bullet')
                }
            }
        })
    }
}

const resetBulletObjects = () => {
    bulletPool.forEach((bullet) => {
        bullet.leftPosition = '-100px'
        bullet.topPosition = '-100px'
        bullet.isIdle = true
        bullet.isUsed = false
    })
}

const useBullet = (bulletElement, bulletObj) => {
    bulletElement.style.left = '-100px'
    bulletElement.style.top = '-100px'
    bulletPool[bulletObj.id].isIdle = true
    bulletPool[bulletObj.id].isUsed = true
}

const generateRandomPosition = () => {
    return generateRandomInt(window.innerWidth, window.innerWidth * 2)
}

const generateRandomEnemySpeed = () => {
    return generateRandomInt(enemiesMinSpeed, enemiesMaxSpeed)
}

const generateRandomHeight = (enemyType) => {
    switch (enemyType) {
        case 1:
            return Math.floor(Math.random() * 400)
        case 2:
            return Math.floor(Math.random() * 1000)
        case 3:
            return Math.floor(Math.random() * 1000)
    }
}

const updateCollisions = () => {
    bulletPool.forEach((bullet) => {
        enemies.forEach((enemy, enemyIdx) => {
            if (!bullet.isUsed && !bullet.isIdle) {
                const bulletSprite = document.querySelector(
                    `[data-bullet="${bullet.id}"]`
                )
                const enemySprite = document.querySelector(
                    `[data-enemy="${enemy.id}"]`
                )
                const collisionDetected = checkElementsCollision(
                    bulletSprite,
                    enemySprite
                )
                if (collisionDetected) {
                    useBullet(bulletSprite, bullet)
                    reduceEnemyHp(enemy, enemyIdx)
                }
            }
        })
    })
}

const reduceEnemyHp = (enemy, enemyIdx) => {
    const bulletSprite = document.querySelector(`[data-enemy="${enemy.id}"]`)
    bulletSprite.classList.add('hit')
    enemy.hp -= bulletPower
    if (enemy.hp > 0) {
        setTimeout(() => {
            bulletSprite.classList.remove('hit')
        }, 1000)
    }
    if (enemy.hp <= 0) {
        bulletSprite.style.display = 'none'
        enemies.splice(enemyIdx, 1)
        enemiesContainer.removeChild(bulletSprite)
    }
    document.querySelector(
        '.enemies-count'
    ).innerHTML = `Enemies Left: ${enemies.length}`
}

const checkElementsCollision = (bulletSprite, enemySprite) => {
    if (!bulletSprite || !enemySprite) return false
    const bulletBoundaries = bulletSprite.getBoundingClientRect()
    const enemyBoundaries = enemySprite.getBoundingClientRect()
    const isCollideOnX =
        bulletBoundaries.x < enemyBoundaries.x + enemyBoundaries.width &&
        bulletBoundaries.x + bulletBoundaries.width > enemyBoundaries.x
    const isCollideOnY =
        bulletBoundaries.y < enemyBoundaries.y + enemyBoundaries.height &&
        bulletBoundaries.y + bulletBoundaries.height > enemyBoundaries.y
    return isCollideOnX && isCollideOnY
}

const setupHeroHandler = () => {
    document.addEventListener('mousemove', (e) => {
        hero.style.top = e.clientY - heroHeight + 'px'
    })
}

const generateRandomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const reloadMag = () => {
    clearInterval(fireInterval)
    resetBulletObjects()
    fillMagazineWithBullets()
    updateBulletsPosition()
}

const updateReloading = () => {
    if (!gameIsRunning) return
    const isEmptyMag = bulletPool.every((bullet) => bullet.isUsed)
    if (isEmptyMag) {
        updateHeroSpriteImage(false)
    }
    if (isEmptyMag && !isReloading) {
        isReloading = true
        clearInterval(fireInterval)
        setTimeout(() => {
            reloadMag()
            isReloading = false
        }, reloadingTime)
    }
}

const onMouseClick = (e) => {
    if (gameIsRunning && e.button === 0) {
        handleMouseDown()
    }
}

const onKeyDown = (key) => {
    if (key.code === 'Space') {
        handleSuperPowerKey()
    }
}

const onMouseUp = () => {
    updateHeroSpriteImage(false)
    clearInterval(fireInterval)
    isFiring = false
}

const updateHeroSpriteImage = (isShooting) => {
    if (isShooting) {
        hero.style.backgroundImage = CHAR_SHOT_SPRITE
        guns.forEach((gun) => (gun.style.transform = 'rotate(7deg) scale(0.7)'))
        gunsEffect.forEach((e) => (e.style.opacity = '1'))
    } else {
        hero.style.backgroundImage = CHAR_IDLE_SPRITE
        guns.forEach(
            (gun) => (gun.style.transform = 'rotate(37deg) scale(0.7)')
        )
        gunsEffect.forEach((e) => (e.style.opacity = '0'))
    }
}

const keepFire = () => {
    isFiring = true
    let heroYPosition = Number(getComputedStyle(hero).top.split('px')[0])
    let heroXPosition = Number(getComputedStyle(hero).left.split('px')[0])
    const bulletTopInitialPosition = heroYPosition + heroHeight + 30
    const bulletLeftInitialPosition = heroXPosition + heroWidth * 2

    const nextFreeBulletIdx = bulletPool.findIndex(
        (bullet) => bullet.isIdle && !bullet.isUsed
    )
    const bulletObj = bulletPool[nextFreeBulletIdx]
    if (nextFreeBulletIdx === -1) return

    bulletObj.isIdle = false
    bulletObj.leftPosition = bulletLeftInitialPosition
    bulletObj.topPosition = bulletTopInitialPosition
}

const handleMouseDown = () => {
    if (!isFiring && gameIsRunning && !isReloading) {
        updateHeroSpriteImage(true)
        fireInterval = setInterval(keepFire, 50)
    }
}

const handleSuperPowerKey = () => {
    if (gameIsRunning && isSuperPowersReady) {
        isSuperPowersReady = false
        document.querySelector('.super-power').style.opacity = '0.1'
        document.querySelector('.super-power').style.color = 'red'
        toggleSuperPowerTitle(true)
        bulletPower += superPower
        setTimeout(() => {
            toggleSuperPowerTitle(false)
            bulletPower -= superPower
        }, superPowerTime)
        setTimeout(() => {
            document.querySelector('.super-power').style.color = '#1ec74c'
            isSuperPowersReady = true
            document.querySelector('.super-power').style.opacity = '1'
        }, superPowerTime)
    }
}

const toggleSuperPowerTitle = (showTitle) => {
    if (showTitle) {
        document.querySelector('h2').style.display = 'block'
    } else document.querySelector('h2').style.display = 'none'
}

const removeEnemiesSprites = () => {
    const elements = document.querySelectorAll('.enemy-a,.enemy-b,.enemy-c')
    elements.forEach((e) => {
        enemiesContainer.removeChild(e)
    })
}

const gameOver = (isWon) => {
    clearGameIntervals()
    resetBulletObjects()
    resetBulletsInitialPosition()
    updateHeroSpriteImage(false)
    removeEnemiesSprites()
    resetGameState()
    toggleElementDisplay('.game-button')
    document.querySelector(`.enemies-count`).innerHTML = isWon
        ? 'You won'
        : 'Game over'
    document.querySelector(`.game-button`).innerHTML = 'Start over!'
}

const prepareNextLevel = () => {
    clearGameIntervals()
    resetBulletObjects()
    resetBulletsInitialPosition()
    updateHeroSpriteImage(false)
    incrementGameState()
    removeEnemiesSprites('enemy')
    toggleElementDisplay('.game-button')
    document.querySelector(`.game-button`).innerHTML = 'Next Wave!'
}

const incrementGameState = () => {
    nextLevelExtraEnemies += 20
    gameIsRunning = false
    isFiring = false
    isReloading = false
    enemies = []
}

const resetGameState = () => {
    nextLevelExtraEnemies = 9
    enemies = []
    gameIsRunning = false
    isFiring = false
}

const instantiateBullets = () => {
    let bulletsElement = ``
    bulletPool.forEach((bullet) => {
        bulletsElement += `<div style="top:${-100}px;left:${-100}px" data-bullet="${
            bullet.id
        }" class="bullet"></div>`
    })
    bulletContainer.innerHTML = bulletsElement
}

const startGame = () => {
    addControllerEvents()
    toggleElementDisplay('.game-button')
    fillMagazineWithBullets()
    instantiateBullets()
    setupHeroHandler()
    gameIsRunning = true
    let nextLevelEnemiesCount = initialEnemiesCount + nextLevelExtraEnemies
    if (nextLevelEnemiesCount > maxEnemies) {
        return gameOver(true)
    }
    instantiateEnemies(nextLevelEnemiesCount)
    startGameIntervals()
}

const toggleElementDisplay = (elementClass, selector = '') => {
    const element = document.querySelector(`${selector}${elementClass}`)
    element.classList.toggle('hide')
}

const clearGameIntervals = () => {
    clearInterval(enemiesInterval)
    clearInterval(bulletsInterval)
    clearInterval(collisionInterval)
    clearInterval(fireInterval)
    clearInterval(reloadingInterval)
}

const startGameIntervals = () => {
    enemiesInterval = setInterval(updateEnemiesPosition, GAME_INTERVALS_SPEED)
    bulletsInterval = setInterval(updateBulletsPosition, GAME_INTERVALS_SPEED)
    collisionInterval = setInterval(updateCollisions, GAME_INTERVALS_SPEED)
    reloadingInterval = setInterval(updateReloading, GAME_INTERVALS_SPEED)
}

const addControllerEvents = () => {
    document.body.addEventListener('mousedown', onMouseClick)
    document.body.addEventListener('mouseup', onMouseUp)
    document.body.addEventListener('keydown', onKeyDown)
}
