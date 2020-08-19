class Utils{
    static creatDom(type,style={},parent=document.body){
        let elem = document.createElement(type);
        for(let key in style)
        elem.style[key] = style[key];
        parent.appendChild(elem);
        return elem;
    }
    static randomColor(alpha=1){
        if(alpha<1 || alpha>1 || isNaN(alpha))
        alpha=1;
        let colorArr = [];
        for(let i = 0;i < 3;i++){
            colorArr.push(Math.floor(Math.random*256));
        }
        return `rgba(${colorArr.join()},${alpha})`;
    }
    static randomNum(min,max){
        return Math.floor(Math.random*(max-min+1))+min;
    }
    static dragElem(elem){
        elem.style.position = 'absolute';
        elem.addEventListener('mousedown',Utils.mouseHandler);
    }
    static mouseHandler(e){
        switch(e.type){
            case 'mousedown':
                e.preventDefault();
                document.addEventListener('mousemove',Utils.mouseHandler);
                document.addEventListener('mouseup',Utils.mouseHandler);
                e.currentTarget.position ={x:e.offsetX,y:e.offsetY};
                document.elem=e.currentTarget;
                e.currentTarget.dispatchEvent(new Event('record'));
                break;
            case 'mousemove':
                document.elem.style.left = e.x - document.elem.position.x+'px';
                document.elem.style.top = e.y - document.elem.position.y+'px';
                document.elem.dispatchEvent(new Event('record'));
                break;
            case 'mouseup':
                document.removeEventListener('mousemove',Utils.mouseHandler);
                document.elem.dispatchEvent(new Event('stoprecord'));
        }
    }
    static removeDrag(elem){
        elem.removeEventListener('mousedown',Utils.mouseHandler);
    }
    static record(elem,point,arr){
        point.x=elem.offsetLeft;
        point.y=elem.offsetTop;
        if(arr)
        arr.push({x:point.x,y:point.y});
    }
    static createFringe(point,pointList,elems){
        let timer = setInterval(() => {
            pointList.push({x:point.x,y:point.y});
            if(pointList.length > elems.length)
            pointList.shift();
            for(let i = 0; i < pointList.length; i++){
                elems[i].style.left = pointList[i].x+'px';
                elems[i].style.top = pointList[i].y+'px';
            }  
        }, 16);        
    }
    static createRoute(elem,arr){
        let newdiv = elem.cloneNode(false);
        document.body.appendChild(newdiv);
        let timer=setInterval(function(){
        let point = arr.shift();
        if(!point)
        {
            clearInterval(timer);
            newdiv.remove();
            return;
        }
        newdiv.style.left = point.x+'px';
        newdiv.style.top = point.y+'px'; 
    },20)
    }
    static loadImg(imgsrc,callback){
        let img = new Image();
        img.imgsrc = imgsrc;
        img.callback = callback;
        img.imgList = [];
        img.num = 0;
        img.addEventListener('load',Utils.loadHandler);
        img.src = imgsrc[img.num];
    }
    static loadHandler(e){
        e.currentTarget.imgList.push( e.currentTarget.cloneNode(false));
        e.currentTarget.num++;
        if(e.currentTarget.num > e.currentTarget.imgsrc.length-1)
        {
            e.currentTarget.callback(e.currentTarget.imgList);
            e.currentTarget.removeEventListener('load',Utils.loadHandler);
            return;
        }
        e.currentTarget.src =  e.currentTarget.imgsrc[e.currentTarget.num];
    }
    static tabChange(tabList,conList,classObj=null){
        let tabArr = Array.from(tabList);
        let preCon = conList[0];
        let preTab = tabArr[0];
        Utils.setTabLine(preTab,1);
        preTab.classList.add(classObj['active']);
        preCon.style.display = 'block';
        tabArr.forEach(item=>{
            item.addEventListener('click',function(e){
                if(preCon)
                {
                    preCon.style.display = 'none';
                    Utils.setTabLine(preTab,0);
                    preTab.classList.remove(classObj['active']);;
                    preTab.classList.add(classObj['disabled']);;
                }
                preCon = conList[tabArr.indexOf(this)];
                preTab = this;
                preTab.classList.remove(classObj['disabled']);;
                preTab.classList.add(classObj['active']);
                Utils.setTabLine(preTab,1);
                preCon.style.display = 'block';
            })
        })
    }
    static setTabLine(elem,flag){
        let line = elem.querySelector('.tabline');
        if(line&&flag)
        line.style.display = 'block';
        else if(line && !flag)
        line.style.display = 'none';
        else return false;
    }
    static setCookie(name,value,{expires,path,domain,secure}={}){
        let str = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
        if(expires){
            str += `;expires=${Utils.afterDate(expires)}`;
        }
        if(path){
            str += `;path=${path}`;
        }
        if(domain){
            str += `;domain=${domain}`;
        }
        if(secure){
            str += `;secure=${secure}`;
        }
        document.cookie = str;
    }
    static getCookie(name){
        let cookieStr = decodeURIComponent(document.cookie);
        let start = cookieStr.indexOf(`${name}=`);
        if(start === -1){
            return null;
        }
        else{
            let end = cookieStr.indexOf(';',start);
            if(end === -1)
            {
                end = cookieStr.length;
            }
            return cookieStr.substring(start,end).split('=')[1];
        }
    }
    static removeCookie(name){
        document.cookie = `${name}=;expires=${new Date(0)}`;
    }
    static afterDate(n){
        let d = new Date();
        let day = d.getDate();
        d.setDate(n+day);
        return d;
    }
}