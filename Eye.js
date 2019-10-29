class Eye {
    constructor(path) {
        this.path = path;
        this.boundingBox = {
            left: path.getBoundingClientRect().left,
            right: path.getBoundingClientRect().right,
            top: path.getBoundingClientRect().top,
            bottom: path.getBoundingClientRect().bottom,
            width: path.getBoundingClientRect().width,
            height: path.getBoundingClientRect().height
        };
        this.cx = (this.boundingBox.right + this.boundingBox.left) / 2; // X offset (X start value of new origin)
        this.cy = (this.boundingBox.bottom + this.boundingBox.top) / 2; // X offset (Y start value of new origin)

        // 1 = full movement, 2 = half movement, 3 = one third movement, 4 = one forth movement, etc.
        this.degreeOfMovement = 4;

       /*
        // ------ EXTRA VALUES IF NEEDED -----
        // start point values in percent
        this.cxPercent = (this.cx * 100 / window.innerWidth);
        this.cyPercent = (this.cy * 100 / window.innerWidth);

        this.radius = this.boundingBox.width / 2;
        */
    }

    // finds rad angle for values outside eye apple to calculate where that delta (X & Y) points need to be on the bounding eye socket circle.
    findAngle(x,y){
        let angleRad = Math.atan2(y - this.cy, x - this.cx);

        const deltaX = this.boundingBox.width * Math.cos(angleRad);
        const deltaY = this.boundingBox.width * Math.sin(angleRad);

        this.updatePoint(deltaX, deltaY);
    }

    // Finds new position based on origin of eye pupil and user (e.clientX & e.clientY) input.
    findPosition(x,y){
        let deltaX = x - this.cx;
        let deltaY = y - this.cy;

        // Check if value is inside eye apple
        if(deltaX < this.boundingBox.width && deltaX > -this.boundingBox.width && deltaY < this.boundingBox.width && deltaY > -this.boundingBox.width){
            this.updatePoint(deltaX, deltaY);

        // Outside eye apple
        }else {
            this.findAngle(x, y);
        }
    }

    updatePoint(deltaX, deltaY){

        this.path.style.transform = `translate(${(deltaX / this.degreeOfMovement) + 'px'}, ${(deltaY / this.degreeOfMovement) + 'px'})`;
    }
}

