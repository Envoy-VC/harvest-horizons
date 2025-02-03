import type { PlantCropProps } from '~/types/game';
import type { GameSceneAbstract } from '../classes/abstract';
import { CropTiles, FarmTile } from '../helpers/data';

import type Phaser from 'phaser';
import { farmerEmitter } from '../emitter';

interface FarmProps {
  scene: GameSceneAbstract;
}

export class Farm {
  cropLayerBase: Phaser.Tilemaps.TilemapLayer;
  cropLayerTop: Phaser.Tilemaps.TilemapLayer;
  totalFarmTiles = 0;
  usedTiles: { x: number; y: number }[];

  constructor({ scene }: FarmProps) {
    const zoom = scene.cameras.main.zoom;
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    this.cropLayerBase = scene.map
      .createBlankLayer('Crop Base', 'crops')!
      .setScale(zoom)
      .setDepth(1);
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    this.cropLayerTop = scene.map
      .createBlankLayer('Crop Top', 'crops')!
      .setScale(zoom)
      .setDepth(2);
    scene.interactionLayer.forEachTile((tile) => {
      if (tile.index === FarmTile) {
        this.totalFarmTiles++;
        this.cropLayerTop.putTileAt(FarmTile, tile.x, tile.y);
        this.cropLayerBase.putTileAt(FarmTile, tile.x, tile.y);
      }
    });
    this.usedTiles = [];

    farmerEmitter.on('plant-crop', ({ type, amount }) => {
      const emptyTiles = this.getEmptyFarmTiles(amount, this.usedTiles);
      this.plantCrops([
        {
          type,
          stage: 'Sprout',
          tiles: emptyTiles,
        },
      ]);
    });
  }

  getEmptyFarmTiles(amount: number, used: { x: number; y: number }[]) {
    const tiles: { x: number; y: number }[] = [];
    let current = 0;
    this.cropLayerBase.forEachTile((tile) => {
      if (
        tile.index === FarmTile &&
        current < amount &&
        !used.find((t) => t.x === tile.x && t.y === tile.y)
      ) {
        tiles.push({ x: tile.x, y: tile.y });
        current++;
      }
    });
    this.usedTiles = this.usedTiles.concat(tiles);
    return tiles;
  }

  plantCrop({ type, stage, tiles }: PlantCropProps) {
    for (const tile of tiles) {
      this.cropLayerBase.putTileAt(CropTiles[type][stage][0], tile.x, tile.y);
      this.cropLayerTop.putTileAt(
        CropTiles[type][stage][1],
        tile.x,
        tile.y - 1
      );
    }
  }

  plantCrops(props: PlantCropProps[]) {
    for (const prop of props) {
      this.plantCrop(prop);
    }
  }

  resetCropLayers() {
    this.cropLayerBase.forEachTile((tile) => {
      if (tile.index !== -1) {
        this.cropLayerBase.putTileAt(FarmTile, tile.x, tile.y);
      }
    });
    this.cropLayerTop.forEachTile((tile) => {
      if (tile.index !== -1) {
        this.cropLayerTop.putTileAt(FarmTile, tile.x, tile.y);
      }
    });
  }
}
