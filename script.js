document.addEventListener("DOMContentLoaded", (ev) => {
    const timeOffset = {hour: 3600000, minute: 60000, second: 1000};
    const form = document.querySelector("form[action=\"#internal-hook#addTimer\"]"), cs = document.getElementById("clockspawn");
    console.info("<c> Sharkbyteprojects");

    let timerInstances = {}, rid = 0;
    function createNamedTimer(name, targetTime){
        if(targetTime==0) return;
        let time = Date.now(); //MS since January 1, 1970
        let id = `E:${rid++}|${time}`;
        console.log("CID: ", id);

        
        let elTree = {parent: document.createElement("div")};
        elTree.parent.classList.add("timerBody");
        elTree.parent.style.borderColor = `hsl(${Math.random()*255}, 100%, 50%)`;
        
        if(name.split(" ").join("").length >= 1){
            elTree.head = document.createElement("h4");
            elTree.head.innerText = name;
            elTree.parent.appendChild(elTree.head);
            elTree.head.classList.add("noselect");
        }

        elTree.time = document.createElement("p");
        elTree.parent.appendChild(elTree.time);
        
        elTree.destroy = document.createElement("button");
        elTree.parent.appendChild(elTree.destroy);
        elTree.destroy.innerText = "Destroy Timer";
        elTree.destroy.classList.add("noselect", "destroy");
        const cio = id;
        elTree.destroy.onclick= () => {
            timerInstances[cio].docTree.parent.remove();
            delete timerInstances[cio];
        };
        
        timerInstances[id] = ({ originTime: time, name, docTree: elTree, finishTime: time + targetTime, interval: targetTime });
        cs.prepend(elTree.parent);
    }

    const hlpr = [form.querySelector("input[name=\"nameOfTimer\"]"), form.querySelector("input[title=\"Hour\"]"), form.querySelector("input[title=\"Minutes\"]"), form.querySelector("input[title=\"Seconds\"]")];
    function resetForm(){
        for(let r of hlpr){
            if(r.type == "number") r.value = "0";
            else r.value="";
        }
    }
    resetForm();
    form.onsubmit = (e) => {
        e.preventDefault();

        createNamedTimer(hlpr[0].value, (parseInt(hlpr[3].value) * timeOffset.second) + (parseInt(hlpr[2].value) * timeOffset.minute) + (parseInt(hlpr[1].value) * timeOffset.hour));
        resetForm();
    };

    function convertTime(ms){
        let r = ms % timeOffset.hour;
        let h = Math.floor(ms / timeOffset.hour);
        let min = Math.floor(r / timeOffset.minute);
        r %= timeOffset.minute;
        let sec = Math.floor(r / timeOffset.second);
        r %= timeOffset.second;
        return {h, min, sec, ms: r};
    }

    function ggyLow(i){
        if(i >= 0)
            return i < 10 ? `0${i}` : `${i}`;
        else
            return `-${ggyLow(Math.abs(i))}`;
    }

    function renderTime(ms){
        let t = convertTime(ms);
        return `${ggyLow(t.h)}:${ggyLow(t.min)}:${ggyLow(t.sec)}`;
    }

    setInterval(() => {
        if(timerInstances.length < 1) return;
        let snap = Date.now();

        for(let ti of Object.values(timerInstances)){
            if(ti == undefined) continue;

            let t = ti.finishTime - snap;
            if(t < 0) {
                ti.docTree.time.innerText = "Timer ended";
                if(window.navigator.vibrate){
                    try{
                        window.navigator.vibrate(100);
                    }catch(e){
                        console.warn("Vibration not working...");
                    }
                }
            } else {
                ti.docTree.time.innerText = `${renderTime(t)}/${renderTime(ti.interval)}`;
            }
        }
    }, 100);


    //REGISTER SW:
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function() {
        navigator.serviceWorker
          .register("sw.js")
          .then(res => console.log("service worker registered"))
          .catch(err => console.log("service worker not registered", err))
      })
    }
    ////////////
    window.onbeforeunload = () => {return false;}
});
