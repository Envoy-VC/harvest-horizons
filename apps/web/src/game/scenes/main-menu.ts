import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenu' });
  }

  create() {
    const { width, height } = this.cameras.main;
    const bg = this.add
      .image(width / 2, height / 2, 'background')
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0);

    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale);

    // Logo
    const logo = this.add
      .image(width / 1.9, height / 5, 'logo')
      .setOrigin(0.5, 0.5);

    logo.setScale(1);

    this.createButton(width / 2, height / 2, 'Play', () =>
      this.scene.start('GameScene')
    );
  }
  createButton(x: number, y: number, text: string, callback: () => void) {
    const button = this.add
      .image(x, y, 'button')
      .setOrigin(0.5, 0.5)
      .setScale(3, 2)
      .setInteractive({ useHandCursor: true });

    this.add
      .text(x, y, text, {
        fontFamily: 'Arial',
        fontSize: 32,
        color: '#3A3A50',
        align: 'center',
      })
      .setOrigin(0.5, 0.5);

    button.on('pointerdown', callback);
  }
}
