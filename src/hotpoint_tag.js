import * as THREE from 'three';

const S = 20;
const waveAnimation = (sprite) => {
    let s = 0;
    s += 0.01;
    if(s<0.5){
        sprite.scale.x = S *(1+s);
        sprite.scale.y = S *(1+s);
    }else if(s>=0.5 && s<1){
        sprite.scale.x = S *(2-s);
        sprite.scale.y = S *(2-s);
    } else {
        s = 0;
    }

    requestAnimationFrame(() => waveAnimation(sprite));
};
const createHotpointTag = (model) => {
    const tagNameArr = ["左前光标", "右后光标", "左后光标", "右前光标", "后备箱光标"];
    const tagArr = [];

    const textureLoader = new THREE.TextureLoader();

    textureLoader.load(
        "hotpoint.png",
        (texture) => {
            for (let i = 0; i < tagNameArr.length; i++) {
                const spriteMaterial = new THREE.SpriteMaterial({
                    map: texture,
                    transparent: true,
                });

                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.scale.set(S, S, 1);

                const tagObj = model.getObjectByName(tagNameArr[i]);
                if (tagObj) {
                    tagObj.add(sprite);

                    if (tagNameArr[i] === "右前光标" || tagNameArr[i] === "右后光标") {
                        sprite.position.z -= sprite.scale.x / 2 ;
                    } else if (tagNameArr[i] === "左前光标" || tagNameArr[i] === "左后光标") {
                        sprite.position.z += sprite.scale.x / 2;
                        sprite.position.y += sprite.scale.x / 3;
                    } else if (tagNameArr[i] === "后备箱光标") {
                        sprite.position.x += sprite.scale.x / 2;
                    }

                    waveAnimation(sprite);
                    // console.log(`Added sprite to ${tagNameArr[i]} at position`, tagObj.position);
                } else {
                    console.warn(`Object with name ${tagNameArr[i]} not found in scene.`);
                }
                tagArr.push(sprite);
            }
        },
        (error) => {
            console.error('Error loading texture:', error);
        }
    );


    return tagArr;
}

export default createHotpointTag;
