import { _decorator, Component, Node, v3, Vec3, Vec2, v2, Prefab, instantiate, tween } from 'cc';
import { TankBullet } from './TankBullet';
import { kfcAudioMgr, kfcCharacterMovement2D, kfcEasyController, kfcEasyControllerEvent } from '../../kfc/kfc';

const { ccclass, property } = _decorator;

const tempV2 = v2();

@ccclass('TankController')
export class TankController extends Component {
    @property(Prefab)
    bullet: Prefab;

    @property(Node)
    firePoint: Node;

    @property(Node)
    barrel: Node;

    private _movement2d: kfcCharacterMovement2D;

    start() {
        kfcEasyController.on(kfcEasyControllerEvent.BUTTON, this.onButtonHit, this);

        this._movement2d = this.node.getComponent(kfcCharacterMovement2D);
    }

    private _isFiring = false;

    onButtonHit(btnSlot: string) {
        if (btnSlot == 'btn_slot_0') {
            if (this._isFiring) {
                return;
            }
            this._isFiring = true;
            let bullet = instantiate(this.bullet);
            this.node.parent.addChild(bullet);
            bullet.setWorldPosition(this.firePoint.worldPosition);
            bullet.setWorldRotation(this.node.worldRotation);
            bullet.getComponent(TankBullet).moveDir = this._movement2d.moveDir;

            kfcAudioMgr.inst.playOneShot('sounds/sfx_shoot',1.0,'tank_game');

            //animation
            let oldPosX = this.barrel.position.x;
            tween(this.barrel).to(0.05, { position: v3(oldPosX - 10, 0, 0) })
                .then(tween(this.barrel).to(0.2, { position: v3(oldPosX, 0, 0) })).call(() => {
                    this._isFiring = false;
                })
                .start();
        }
    }

    onDestroy() {
        kfcEasyController.off(kfcEasyControllerEvent.BUTTON, this.onButtonHit, this);
    }
}


