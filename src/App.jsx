import {useCallback,useEffect,useRef,useState} from 'react';
import PlannerCanvas from './components/PlannerCanvas.jsx';
import Sidebar from './components/Sidebar.jsx';
import Toolbar from './components/Toolbar.jsx';
import CanvasToolbar from './components/CanvasToolbar.jsx';
import {initialItems} from './data/initialTree.js';
import {loadItems,saveItems,loadLinks,saveLinks,loadMode,saveMode,exportItems,importItems} from './lib/storage.js';
import {descendants,autoLayout} from './lib/tree.js';
function newId(){return typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():'node-'+Date.now()+'-'+Math.random().toString(36).slice(2);}
export default function App(){
const [items,setItems]=useState(loadItems);
const [links,setLinks]=useState(loadLinks);
const [layoutMode,setLayoutMode]=useState(loadMode);
const [selectedId,setSelectedId]=useState(null);
const [saved,setSaved]=useState(true);
const [toast,setToast]=useState('');
const [history,setHistory]=useState([]);
const selected=items.find(x=>x.id===selectedId)||null;
const latest=useRef({items,links});latest.current={items,links};
const checkpoint=useCallback(()=>setHistory(h=>[...h.slice(-19),structuredClone(latest.current)]),[]);
useEffect(()=>{setSaved(saveItems(items)&&saveLinks(links));},[items,links]);
useEffect(()=>{saveMode(layoutMode);},[layoutMode]);
const select=useCallback(id=>setSelectedId(id),[]);
const move=useCallback((id,pos)=>setItems(old=>old.map(x=>x.id===id?{...x,x:pos.x,y:pos.y}:x)),[]);
const add=useCallback(parentId=>{checkpoint();const id=newId();setItems(old=>{const parent=old.find(x=>x.id===parentId);const siblings=old.filter(x=>x.parentId===parentId);const x=parent?parent.x+310:60;const y=parent?parent.y+siblings.length*125:siblings.length*125+120;return [...old.map(x=>x.id===parentId?{...x,collapsed:false}:x),{id,parentId:parent?.id??null,title:'Новый элемент',type:'task',status:'todo',notes:'',collapsed:false,x,y}];});setSelectedId(id);},[checkpoint]);
const toggle=useCallback(id=>setItems(old=>old.map(x=>x.id===id?{...x,collapsed:!x.collapsed}:x)),[]);
const change=useCallback(patch=>setItems(old=>old.map(x=>x.id===selectedId?{...x,...patch}:x)),[selectedId]);
const connect=useCallback((source,target)=>{if(source===target)return;const state=latest.current;if(state.links.some(l=>l.source===source&&l.target===target)||state.items.some(x=>x.id===target&&x.parentId===source))return;checkpoint();setLinks(old=>[...old,{id:'link-'+newId(),source,target}]);},[checkpoint]);
const remove=useCallback(id=>{const target=items.find(x=>x.id===id);if(!target||target.parentId===null)return;const ids=descendants(items,id);if(window.confirm('Удалить элемент и все его подветви ('+ids.size+')?')){checkpoint();setItems(old=>old.filter(x=>!ids.has(x.id)));setLinks(old=>old.filter(x=>!ids.has(x.source)&&!ids.has(x.target)));setSelectedId(null);}},[items,checkpoint]);
const reset=()=>{if(window.confirm('Заменить текущую карту стартовой? Сначала экспортируйте резервную копию.')){checkpoint();setItems(initialItems.map(x=>({...x})));setLinks([]);setSelectedId(null);}};
const importFile=async file=>{try{const data=await importItems(file);if(window.confirm('Заменить текущую карту данными из файла?')){checkpoint();setItems(data.items);setLinks(data.links);setSelectedId(null);setToast('Карта импортирована');}}catch(e){setToast('Ошибка импорта: '+e.message);}setTimeout(()=>setToast(''),4500);};
const undo=()=>setHistory(h=>{if(!h.length)return h;const prev=h[h.length-1];setItems(prev.items);setLinks(prev.links);setSelectedId(null);return h.slice(0,-1);});
const focus=()=>{if(!selectedId){setToast('Сначала выберите элемент на карте');setTimeout(()=>setToast(''),2500);return;}document.querySelector('.react-flow__node.selected')?.scrollIntoView({block:'center',inline:'center',behavior:'smooth'});};
return <div className="app"><Toolbar count={items.length} saved={saved} onAdd={()=>add(selectedId)} onExport={()=>exportItems(items,links)} onImport={importFile} onReset={reset}/><main><div className="workspace"><PlannerCanvas items={items} links={links} layoutMode={layoutMode} selectedId={selectedId} onSelect={select} onMove={move} onAdd={add} onToggle={toggle} onConnect={connect}/><CanvasToolbar layoutMode={layoutMode} onModeChange={setLayoutMode} onLayout={()=>{checkpoint();setItems(old=>autoLayout(old));}} onExpand={()=>setItems(old=>old.map(x=>({...x,collapsed:false})))} onCollapse={()=>setItems(old=>old.map(x=>({...x,collapsed:x.parentId!==null&&x.parentId!==undefined})))} onFocus={focus} onUndo={undo} canUndo={history.length>0}/><div className="canvas-hint">Колесо — масштаб · перетаскивание — расположение · соедините точки узлов для создания связи</div></div><Sidebar item={selected} onChange={change} onAdd={add} onDelete={remove} onClose={()=>select(null)} childCount={items.filter(x=>x.parentId===selectedId).length}/></main>{toast&&<div className="toast" role="status">{toast}</div>}</div>;
}
