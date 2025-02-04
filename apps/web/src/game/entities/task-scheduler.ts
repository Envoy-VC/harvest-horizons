import PQueue from 'p-queue';
import type { NPCAction, NPCMoveArgs } from '~/types/game';
import type { NPCAbstract } from '../classes/abstract';
import type { GameSceneAbstract } from '../classes/abstract/game-scene';

export class TaskScheduler {
  queue: PQueue;
  constructor() {
    this.queue = new PQueue({ concurrency: 1 });
  }

  async addTask({
    scene,
    task,
  }: { scene: GameSceneAbstract; task: NPCAction }) {
    this.queue.pause();
    const farmer = scene.npcs[0];
    if (!farmer) {
      return;
    }
    if (task.action === 'move') {
      await this.queue.add(() => {
        this.move(farmer, task.args, scene);
      });
    }
  }

  startTasks() {
    this.queue.start();
  }

  pauseTasks() {
    this.queue.pause();
  }

  clearTasks() {
    this.queue.clear();
  }

  async move(npc: NPCAbstract, args: NPCMoveArgs, scene: GameSceneAbstract) {
    await npc.moveTo({ tileX: args.x, tileY: args.y, scene });
  }
}
