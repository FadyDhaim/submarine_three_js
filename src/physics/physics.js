import Vector from "/Vector.js";

class Physic {
    // الثوابت
    static _GRAVITY_ACCELERATION = 0.0098;
    static _DENSITY_OF_LIQUID = 0.47;
    static _PRESSURE_COEFFICIENT = 0.002;
    static _FRICTION_COEFFICIENT = 0.002;
    static _DEPTH = 10;

    //ارخميدس
    static CalculateArchimedesForce(objectVolume) {
        const archimedesForceMagnitude = this._DENSITY_OF_LIQUID * this._GRAVITY_ACCELERATION * objectVolume;
        const archimedesForce = new Vector(0, archimedesForceMagnitude, 0);
        return archimedesForce;
    }
    //الثقل
    static CalculateWeightForce(mass) {
        const weightForce = this._GRAVITY_ACCELERATION * mass;
        const weightVector = new Vector(0, weightForce, 0);
        return weightVector;
    }

    //دفع المحرك
    static CalculateEngineForce(power, fanRPM) {
        const forceZ = power * fanRPM;
        const engineForce = new Vector(0, 0, forceZ);
        return engineForce;
    }

    //قولى المقاومة
    static CalculateResistanceForce(area, velocity) {
        const frictionCoefficient = this._FRICTION_COEFFICIENT;
        const density = this._DENSITY_OF_LIQUID;
        const velocityMagnitude = velocity.getLength();

        const resistanceX = 0.5 * frictionCoefficient * density * area.x * velocityMagnitude * velocity.x;
        const resistanceY = 0.5 * frictionCoefficient * density * area.y * velocityMagnitude * velocity.y;
        const resistanceZ = 0.5 * frictionCoefficient * density * area.z * velocityMagnitude * velocity.z;

        return new Vector(resistanceX, resistanceY, resistanceZ);
    }

    // القصور الذاتي للاسطوانة
    static CalculateMomentOfInertiaOfCylinder(mass, radius, length) {
        const I_longitudinal = 0.5 * mass * radius ** 2;
        const I_transverse = 0.25 * mass * radius ** 2 + (1 / 12) * mass * length ** 2;

        return [
            [I_transverse, 0, 0],
            [0, I_transverse, 0],
            [0, 0, I_longitudinal]
        ];
    }

    //مساحة السطح الجانبي للاسطونة
    static CalculateCylinderArea(radius, length) {
        const area = 2 * Math.PI * radius * length;
        return area;
    }

    //حجم الاستطوانة
    static CalculateCylinderVolume(radius, length) {
        const volume = Math.PI * radius ** 2 * length;
        return volume;
    }

    //افقي حول Y
    static CalculateResistanceForceOnHorizontalPlanes(forceZ, forceX, angle) {
        const angleRadians = angle * (Math.PI / 180);

        const resistanceForceZ_Z = forceZ * Math.cos(angleRadians) * Math.cos(angleRadians);
        const resistanceForceZ_X = forceZ * Math.cos(angleRadians) * Math.sin(angleRadians);
        const resistanceForceX_Z = forceX * Math.sin(angleRadians) * Math.cos(angleRadians);
        const resistanceForceX_X = forceX * Math.sin(angleRadians) * Math.sin(angleRadians);

        const totalResistanceForceX = resistanceForceZ_X + resistanceForceX_X;
        const totalResistanceForceZ = resistanceForceZ_Z + resistanceForceX_Z;

        const resistanceForce = new Vector(totalResistanceForceX, 0, totalResistanceForceZ);

        return resistanceForce.Rotation_Y(angle);
    }

    //عامودي حول X
    static CalculateResistanceForceOnVerticalPlanes(forceY, forceZ, angle) {
        const angleRadians = angle * (Math.PI / 180);

        const resistanceForceY_Y = forceY * Math.cos(angleRadians) * Math.cos(angleRadians);
        const resistanceForceY_Z = forceY * Math.sin(angleRadians) * Math.cos(angleRadians);
        const resistanceForceZ_Y = forceZ * Math.sin(angleRadians) * Math.sin(angleRadians);
        const resistanceForceZ_Z = forceZ * Math.cos(angleRadians) * Math.sin(angleRadians);

        const totalResistanceForceZ = resistanceForceY_Z + resistanceForceZ_Z;
        const totalResistanceForceY = resistanceForceY_Y + resistanceForceZ_Y;

        const resistanceForce = new Vector(0, totalResistanceForceY, totalResistanceForceZ);

        return resistanceForce.Rotation_X(angle);
    }

    //جليد
    static CalculateIcePressureForce(area, velocity) {
        const frictionCoefficient = this._FRICTION_COEFFICIENT;
        const density = this._DENSITY_OF_LIQUID;
        const velocityMagnitude = velocity.getLength();

        const resistanceY = frictionCoefficient * density * area * velocityMagnitude * velocity.y;

        return new Vector(0, resistanceY, 0);
    }

    //تيارات بحرية
    static CalculateStrengthOfOceanCurrents(area, velocity) {

        const frictionCoefficient = this._FRICTION_COEFFICIENT;
        const density = this._DENSITY_OF_LIQUID;
        const velocityMagnitude = velocity.getLength();

        const resistanceX = frictionCoefficient * density * area * velocityMagnitude * velocity.x;

        return new Vector(resistanceX, 0, 0);
    }

}

export default Physic;







// // مثال على الاستخدام الطفو
// const objectVolume = 10; // حجم الجسم
// const archimedesForce = Physic.CalculateArchimedesForce(objectVolume);
// console.log(`Archimedes Force: ${archimedesForce.toString()}`);


// // مثال على الاستخدام قوة جر المحرك
// const power = 1000; // استطاعة محرك الغواصة بالواط
// const fanRPM = 20; // عدد دورات المروحة بالثانية

// const engineForce = Physic.CalculateEngineForce(power, fanRPM);
// console.log(`Engine force: ${engineForce.toString()}`);



// مثال على الاحتكاك على بدن الغواصة
// const area = new Vector(Math.PI * Math.pow(2, 2), 2 * Math.PI * 2 * 500, 2 * Math.PI * 2 * 500); // مساحة المقطع للغواصة
// const velocity = new Vector(10, 5, 3); // سرعة الغواصة

// const resistanceForce1 = Physic.CalculateStrengthOfOceanCurrents(Physic.CalculateCylinderArea(2 , 500), velocity);
// console.log(`Resistance force: ${resistanceForce1.toString()}`);




// // مثال على الاستخدام عزم عطالة اسطوانة مسمطة
// const mass = 1000; // كتلة الغواصة بالكيلوغرام
// const radius = 2; // نصف قطر الغواصة بالمتر
// const length = 20; // طول الغواصة بالمتر

// const momentOfInertiaMatrix = Physic.CalculateMomentOfInertiaOfCylinder(mass, radius, length);
// console.log(`Moment of Inertia Matrix:`);
// console.table(momentOfInertiaMatrix);

// const cylinderArea = Physic.CalculateCylinderArea(radius, length);
// console.log(`Cylinder Area: ${cylinderArea}`);

// const cylinderVolume = Physic.CalculateCylinderVolume(radius, length);
// console.log(`Cylinder Volume: ${cylinderVolume}`);


// //الافقية
// const forceY = 500; // مثال لقوة في الاتجاه Y
// const forceX = 300; // مثال لقوة في الاتجاه X
// const angle = 30; // زاوية الميل بالدرجات

// const resistanceForce = Physic.CalculateResistanceForceOnHorizontalPlanes(forceY, forceX, angle);
// console.log(`Resistance Force on Horizontal Planes: ${resistanceForce.toString()}`);