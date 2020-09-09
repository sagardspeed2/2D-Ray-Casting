class Particle {
    constructor () {
        this.pos = createVector(sceneW / 2, sceneH / 2);
        this.fov = 45;
        this.rays = [];
        this.headings = 0;
        for (let a = -this.fov / 2; a < this.fov / 2; a += 1) {
            this.rays.push(new Ray(this.pos, radians(a)));
        }
    }

    updateFOV (fov) {
        this.fov = fov;
        this.rays = [];
        for (let a = -this.fov / 2; a < this.fov / 2; a += 1) {
            this.rays.push(new Ray(this.pos, radians(a) + this.headings));
        }
    }

    rotate (angle) {
        this.headings += angle;
        let index = 0;
        for (let a = -this.fov / 2; a < this.fov / 2; a += 1) {
            this.rays[index].setAngle(radians(a) + this.headings);
            index++;
        }
    }

    move (amt) {
        const vel = p5.Vector.fromAngle(this.headings);
        vel.setMag(amt);
        this.pos.add(vel);
    }

    update (x, y) {
        this.pos.set(x, y);
    }

    look (walls) {
        const scene = [];
        for (let i = 0; i < this.rays.length; i++) {
            const ray = this.rays[i];
            let closet = null;
            let record = Infinity;
            for (let wall of walls) {
                const pt = ray.cast(wall);
                if (pt) {
                    let d = p5.Vector.dist(this.pos, pt);
                    const a = ray.dir.heading() - this.headings;
                    if (!mouseIsPressed) {
                        d *= cos(a);
                    }
                    if (d < record) {
                        record = d;
                        closet = pt;
                    }
                }
            }
            if (closet) {
                stroke(255, 100);
                line(this.pos.x, this.pos.y, closet.x, closet.y);
            }
            scene[i] = record;
        }
        return scene;
    }

    show () {
        fill(255);
        ellipse(this.pos.x, this.pos.y, 4);
        for ( let ray of this.rays ) {
            ray.show();
        }
    }
}