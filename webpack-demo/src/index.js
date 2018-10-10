import _ from 'lodash';
import './style.css'
import icon from './asset/icons/cancel.png'
import data from './data.xml'

function component() {
  var element = document.createElement('div');

  // Lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  const myicon = new Image();
  myicon.src = icon;
  element.appendChild(myicon);

  console.log(data);

  return element;
}

document.body.appendChild(component());