import Phaser from 'phaser';

import type { CreatePlayerProps } from '~/types/game';

export interface CursorKeys {
  up: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
}

export const createCursorKeys = (
  keyboard: Phaser.Input.Keyboard.KeyboardPlugin
) => {
  return keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    right: Phaser.Input.Keyboard.KeyCodes.D,
  }) as {
    up: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
};

export const createAnimations = (scene: Phaser.Scene, key: string) => {
  const framesPerRow = 13;
  const directions = [
    {
      key: 'north',
      rowIndex: 8,
    },
    {
      key: 'west',
      rowIndex: 9,
    },
    {
      key: 'south',
      rowIndex: 10,
    },
    {
      key: 'east',
      rowIndex: 11,
    },
  ];
  for (const direction of directions) {
    scene.anims.create({
      key: `${key}-walk-${direction.key}`,
      frames: scene.anims.generateFrameNumbers(key, {
        start: direction.rowIndex * framesPerRow,
        end: direction.rowIndex * framesPerRow + 8,
      }),
      frameRate: 9,
      repeat: -1,
    });
  }
  for (const direction of directions) {
    scene.anims.create({
      key: `${key}-idle-${direction.key}`,
      frames: scene.anims.generateFrameNumbers(key, {
        start: direction.rowIndex * framesPerRow,
        end: direction.rowIndex * framesPerRow,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }
};

export const registerMovement = (
  key: string,
  cursors: CursorKeys,
  speed: number,
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  scene: CreatePlayerProps['scene']
) => {
  const { left, right, up, down } = cursors;

  if (scene.isModalOpen) {
    return;
  }

  // Reset velocity
  let velocityX = 0;
  let velocityY = 0;
  let animationKey = '';

  // Check input for movement
  if (left.isDown) {
    velocityX = -speed;
    animationKey = `${key}-walk-west`;
  } else if (right.isDown) {
    velocityX = speed;
    animationKey = `${key}-walk-east`;
  } else if (up.isDown) {
    velocityY = -speed;
    animationKey = `${key}-walk-north`;
  } else if (down.isDown) {
    velocityY = speed;
    animationKey = `${key}-walk-south`;
  }

  sprite.body.setVelocity(velocityX, velocityY);

  if (velocityX !== 0 || velocityY !== 0) {
    sprite.anims.play(animationKey, true);
  } else {
    // Set idle animation based on last played direction
    const currentAnimation = sprite.anims.currentAnim?.key;
    if (currentAnimation) {
      const idleKey = currentAnimation.replace('walk', 'idle');
      sprite.anims.play(idleKey, true);
    }
  }
};

export function getRandomTileNear(
  tileX: number,
  tileY: number,
  range: number,
  collisionLayer: Phaser.Tilemaps.TilemapLayer
): { x: number; y: number } | null {
  const map = collisionLayer.tilemap;

  // Define the boundaries of the rectangle around the given tile
  const minX = Math.max(tileX - range, 1);
  const maxX = Math.min(tileX + range, map.width * 2 - 2);
  const minY = Math.max(tileY - range, 1);
  const maxY = Math.min(tileY + range, map.height * 2 - 2);

  // Collect all valid non-colliding tiles
  const validTiles: { x: number; y: number }[] = [];
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      const tile = collisionLayer.getTileAt(
        x,
        y
      ) as Phaser.Tilemaps.Tile | null;
      let isColliding = false;
      if (tile) {
        isColliding =
          'collides' in tile.properties
            ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- safe
              Boolean(tile.properties.collides)
            : false;
      } else {
        isColliding = false;
      }

      if (!isColliding) {
        validTiles.push({ x, y });
      }
    }
  }

  // If there are no valid tiles, return null
  if (validTiles.length === 0) {
    return null;
  }

  // Select a random valid tile
  const randomIndex = Math.floor(Math.random() * validTiles.length);
  // biome-ignore lint/style/noNonNullAssertion: This is a valid index
  return validTiles[randomIndex]!;
}
