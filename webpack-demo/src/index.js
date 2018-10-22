import _ from 'lodash';
import './style.css'
import icon from './asset/icons/cancel.png'
import data from './data.xml'

function component() {
  const element = document.createElement('div');

  // Lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  const myicon = new Image();
  myicon.src = icon;
  element.appendChild(myicon);

  const btn = document.createElement('button');
  btn.innerHTML = 'Click me and check the console!';
  btn.onclick = e =>
    import ('./print.js').then((module) => {
      const print = module.default;
      print();
    });
  element.appendChild(btn);

  console.log(data);

  return element;
}

document.body.appendChild(component());