import { DiagonalMovement, Grid, JumpPointFinder } from 'pathfinding';
import type Phaser from 'phaser';

export class Pathfinder {
  private grid: Grid;

  constructor(collisionLayer: Phaser.Tilemaps.TilemapLayer) {
    this.grid = this.createPathfinderGrid(collisionLayer);
  }

  createPathfinderGrid(layer: Phaser.Tilemaps.TilemapLayer) {
    const width = layer.tilemap.width * 2;
    const height = layer.tilemap.height * 2;
    const grid = new Grid(width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tile = layer.getTileAt(x, y) as Phaser.Tilemaps.Tile | null;
        let isColliding = false;
        if (tile) {
          isColliding =
            'collides' in tile.properties
              ? Boolean(tile.properties.collides)
              : false;
        } else {
          isColliding = false;
        }

        if (isColliding) {
          grid.setWalkableAt(x, y, false);
        } else {
          grid.setWalkableAt(x, y, true);
        }
      }
    }
    return grid;
  }

  findPath(startX: number, startY: number, endX: number, endY: number) {
    const gridClone = this.grid.clone();
    // Not using AStarFinder because more no of turns at each point, so looks not natural
    const finder = JumpPointFinder({
      diagonalMovement: DiagonalMovement.Never,
    });
    return finder.findPath(startX, startY, endX, endY, gridClone);
  }
}
