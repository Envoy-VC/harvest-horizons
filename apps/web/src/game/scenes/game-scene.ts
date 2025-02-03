import Phaser from 'phaser';

import GameMap from 'public/assets/map.json';

import { Pathfinder } from '../classes';
import type { GameSceneAbstract, NPCAbstract } from '../classes/abstract';
import { Farm, InteractionText, NPC, Player } from '../entities';
import { type CursorKeys, createCursorKeys } from '../helpers/movement';

import type { GameSceneProps } from '~/types/game';
import { world } from '../state';

export class GameScene extends Phaser.Scene implements GameSceneAbstract {
  map!: Phaser.Tilemaps.Tilemap;
  collisionLayer!: Phaser.Tilemaps.TilemapLayer;
  interactionLayer!: Phaser.Tilemaps.TilemapLayer;
  player!: Player;
  npcs!: NPCAbstract[];
  cursors!: CursorKeys;
  pathfinder!: Pathfinder;
  farm!: Farm;
  interactionText!: InteractionText;
  isModalOpen: boolean;
  tileSize: number;
  config: GameSceneProps['config'];

  constructor(props: GameSceneProps) {
    super({ key: 'GameScene' });
    this.config = props.config;
    this.isModalOpen = false;
    this.tileSize = 16;
  }

  create() {
    const mapWidth = this.config.mapSize.x * 16;
    const mapHeight = this.config.mapSize.y * 16;
    this.cameras.main.setZoom(2);
    const zoom = this.cameras.main.zoom;
    this.cameras.main.roundPixels = true;
    this.cameras.main.setBounds(
      0,
      0,
      this.config.mapSize.x * 16 * zoom,
      this.config.mapSize.y * 16 * zoom
    );

    const map = this.make.tilemap({
      key: 'world',
      tileHeight: 16,
      tileWidth: 16,
    });

    this.map = map;

    const tilesets = GameMap.tilesets.map((tileset) => {
      // biome-ignore lint/style/noNonNullAssertion: safe as that image should exist
      return map.addTilesetImage(tileset.name, tileset.name)!;
    });
    for (const layer of map.layers) {
      if (layer.name === 'Collision') {
        // biome-ignore lint/style/noNonNullAssertion: safe
        this.collisionLayer = map
          .createLayer(layer.name, tilesets, 0, 0)!
          .setScale(zoom)
          .setAlpha(0);
      } else if (layer.name === 'Interaction') {
        // biome-ignore lint/style/noNonNullAssertion: safe
        this.interactionLayer = map
          .createLayer(layer.name, tilesets, 0, 0)!
          .setScale(zoom)
          .setAlpha(0);
      } else if (layer.name.includes('Trees')) {
        // biome-ignore lint/style/noNonNullAssertion: safe
        map.createLayer(layer.name, tilesets, 0, 0)!.setScale(zoom);
      } else {
        // biome-ignore lint/style/noNonNullAssertion: safe
        map.createLayer(layer.name, tilesets, 0, 0)!.setScale(zoom).setDepth(0);
      }
    }

    // Set Pathfinder
    this.pathfinder = new Pathfinder(this.collisionLayer);

    const data = this.scene.settings.data as {
      playerPosition?: { x: number; y: number };
    };

    this.player = new Player({
      x: data.playerPosition?.x ?? this.config.playerPosition.x,
      y: data.playerPosition?.y ?? this.config.playerPosition.y,
      sprite: 'trader',
      speed: 50,
      scene: this,
    });

    this.npcs = [];
    this.npcs.push(
      new NPC({ x: 100, y: 100, sprite: 'farmer', speed: 50, scene: this })
    );
    for (const npc of this.npcs) {
      this.physics.add.collider(this.player.sprite, npc.sprite);
    }

    // Farm
    this.farm = new Farm({ scene: this });

    // Set Collision with World Bounds and Collision Layer
    this.physics.world.setBounds(0, 0, mapWidth * zoom, mapHeight * zoom);
    this.collisionLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player.sprite, this.collisionLayer);

    // Set Collision with Interaction Layer
    this.physics.add.collider(this.player.sprite, this.interactionLayer);

    // Create Cursor Keys
    this.cursors = createCursorKeys(
      this.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin
    );

    // Set Camera to Follow Player
    this.cameras.main.startFollow(this.player.sprite);

    // Set Interaction Text
    this.interactionText = new InteractionText(this);
  }

  update(time: number, delta: number) {
    this.player.update({ scene: this, time, delta });
    for (const npc of this.npcs) {
      npc.update({ scene: this, time, delta });
    }

    this.interactionText.update({ scene: this, time, delta });

    if (world.isInteractionModalOpen !== this.isModalOpen) {
      this.isModalOpen = world.isInteractionModalOpen;

      if (world.isInteractionModalOpen) {
        // Disable keyboard input when the modal is open
        this.input.keyboard?.disableGlobalCapture();
        // biome-ignore lint/style/noNonNullAssertion: safe
        this.input.keyboard!.enabled = false;
      } else {
        // Enable keyboard input when the modal is closed
        this.input.keyboard?.enableGlobalCapture();
        // biome-ignore lint/style/noNonNullAssertion: safe
        this.input.keyboard!.enabled = true;
      }
    }
  }

  shutdown() {
    this.input.keyboard?.removeAllListeners(); // Remove all keyboard listeners
    this.physics.world.shutdown(); // Stop physics
    this.children.removeAll();
  }
}
