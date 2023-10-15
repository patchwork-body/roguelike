const app = document.getElementById('app') as HTMLCanvasElement;

const context = app.getContext('2d');
app.width = window.innerWidth;
app.height = window.innerHeight;

type TileSymbol =  '-' | '!' | '*' | '&' | '^';

const ROCK = [0, 128] as const
const ROCK_CRACKED = [0, 240] as const
const GRASS = [0, 0] as const
const FLOWER_WHITE_1 = [128, 48] as const
const FLOWER_WHITE_2 = [128, 112] as const

const TILES: Record<TileSymbol, readonly [number, number]> = {
  '*': ROCK,
  '-': ROCK_CRACKED,
  '!': GRASS,
  '&': FLOWER_WHITE_1,
  '^': FLOWER_WHITE_2,
}

const allTiles = ['-', '!', '*', '&', '^']
const grassNeighbors = ['!', '*', '&', '^']
const flowerNeighbor = ['!'] 
const rockNeighbor = ['*', '-', '!']
const rockCrackedNeighbors = ['*', '!']

const getRandomTile = (tiles: string[]): TileSymbol => {
  const tilesI = Math.max(Math.round((Math.random() * tiles.length - 1)), 0)
  return tiles[tilesI] as TileSymbol
}

const getNextTile = (tile?: TileSymbol) => {
  if (!tile) {
    return getRandomTile(allTiles);
  }

  switch(tile) {
    case '!':
      return getRandomTile(grassNeighbors)    
    case '&':
      return getRandomTile(flowerNeighbor)
    case '^':
      return getRandomTile(flowerNeighbor)
    case '*':
      return getRandomTile(rockNeighbor)
    case '-':
      return getRandomTile(rockCrackedNeighbors)
  }
}

const generateMap = () => {
  const map = []

  for (let y = 0; y <= 100; y++) {
    map[y] = [getNextTile()]
    for (let x = 0; x <= 100; x++) {
      const nextTile = getNextTile(map[y][x])
      map[y].push(nextTile)
    }
  }

  return map
}

const GAME_MAP = generateMap();

let lastTime = 0;
const FPS = 60;
const mapTiles = new Image();
mapTiles.src = '/assets/map-tiles.png';

const animate: FrameRequestCallback = (timestamp) => {
  const deltaTime = timestamp - lastTime;
  const interval = 1000 / FPS;

  if (deltaTime > interval) {
    let x = 0
    context?.clearRect(0, 0, app.width, app.height);

    GAME_MAP.forEach((line, yIndex) => {
      line.forEach((symbol, xIndex) => {
        context?.drawImage(mapTiles, ...TILES[symbol], 16, 16, xIndex * 32, yIndex * 32, 32, 32)
      })
    })
  }

  requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
