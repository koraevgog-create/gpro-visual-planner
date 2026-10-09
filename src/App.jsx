import {useCallback,useEffect,useState} from 'react';
import PlannerCanvas from './components/PlannerCanvas.jsx';
import Sidebar from './components/Sidebar.jsx';
import Toolbar from './components/Toolbar.jsx';
import CanvasToolbar from './components/CanvasToolbar.jsx';
import {initialItems} from './data/initialTree.js';
import {loadItems,saveItems,exportItems,importItems} from './lib/storage.js';
import {descendants,autoLayout} from './lib/tree.js';
function newId(){return typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():'node-'+Date.now()+'-'+Math.random().toString(36).slice(2);}
export default function App(){
const [items,setItems]=useState(loadItems);const [selectedId,setSelectedId]=useState(null);const [saved,setSaved]=useState(true);const [toast,setToast]=useState('');const selected=items.find(x=>x.id===selectedId)||null;
useEffect(()=>{setSaved(saveItems(items));},[items]);
const select=useCallback(id=>setSelectedId(id),[]);
const move=useCallback((id,pos)=>setItems(old=>old.map(x=>x.id===id?{...x,x:pos.x,y:pos.y}:x)),[]);
const add=useCallback(parentId=>{const id=newId();setItems(old=>{const parent=old.find(x=>x.id===parentId);const siblings=old.filter(x=>x.parentId===parentId);const x=parent?parent.x+310:60;const y=parent?parent.y+siblings.length*125:siblings.length*125+120;return [...old.map(x=>x.id===parentId?{...x,collapsed:false}:x),{id,parentId:parent?.id??null,title:'Новый элемент',type:'task',status:'todo',notes:'',collapsed:false,x,y}];});setSelectedId(id);},[]);
const toggle=useCallback(id=>setItems(old=>old.map(x=>x.id===id?{...x,collapsed:!x.collapsed}:x)),[]);
const change=useCallback(patch=>setItems(old=>old.map(x=>x.id===selectedId?{...x,...patch}:x)),[selectedId]);
const remove=useCallback(id=>{const target=items.find(x=>x.id===id);if(!target||target.parentId===null)return;const ids=descendants(items,id);if(window.confirm('Удалить выбранный элемент и все его подветви ('+ids.size+')?')){setItems(old=>old.filter(x=>!ids.has(x.id)));setSelectedId(null);}},[items]);
const reset=()=>{if(window.confirm('Заменить текущую карту стартовой? Сначала экспортируйте резервную копию.')){setItems(initialItems.map(x=>({...x})));setSelectedId(null);}};
const importFile=async file=>{try{const data=await importItems(file);if(window.confirm('Заменить текущую карту данными из файла?')){setItems(data);setSelectedId(null);setToast('Карта импортирована');}}catch(e){setToast('Ошибка импорта: '+e.message);}setTimeout(()=>setToast(''),4500);};
return <div className="app"><Toolbar count={items.length} saved={saved} onAdd={()=>add(selectedId)} onExport={()=>exportItems(items)} onImport={importFile} onReset={reset}/><main><div className="workspace"><PlannerCanvas items={items} selectedId={selectedId} onSelect={select} onMove={move} onAdd={add} onToggle={toggle}/><CanvasToolbar onLayout={()=>setItems(old=>autoLayout(old))} onExpand={()=>setItems(old=>old.map(x=>({...x,collapsed:false})))} onCollapse={()=>setItems(old=>old.map(x=>({...x,collapsed:x.parentId!==null&&x.parentId!==undefined})))}/><div className="canvas-hint">Колесо — масштаб · фон — перемещение · кнопки на узлах — ветви</div></div><Sidebar item={selected} onChange={change} onAdd={add} onDelete={remove} onClose={()=>select(null)} childCount={items.filter(x=>x.parentId===selectedId).length}/></main>{toast&&<div className="toast" role="status">{toast}</div>}</div>;
}
