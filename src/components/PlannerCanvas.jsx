import {useMemo,useCallback} from 'react';
import {ReactFlow,Background,Controls,MiniMap,MarkerType} from '@xyflow/react';
import PlannerNode from './PlannerNode.jsx';
import {visibleTree,progressFor} from '../lib/tree.js';
const nodeTypes={planner:PlannerNode};
export default function PlannerCanvas({items,links,onSelect,onMove,onAdd,onToggle,onConnect,selectedId,layoutMode}){
 const visible=useMemo(()=>visibleTree(items),[items]);
 const ids=useMemo(()=>new Set(visible.map(x=>x.id)),[visible]);
 const nodes=useMemo(()=>visible.map(item=>({id:item.id,type:'planner',position:{x:item.x,y:item.y},data:{item,children:items.filter(x=>x.parentId===item.id).length,progress:progressFor(items,item.id),onAdd,onToggle},selected:selectedId===item.id})),[visible,items,selectedId,onAdd,onToggle]);
 const edges=useMemo(()=>[...visible.filter(x=>x.parentId&&ids.has(x.parentId)).map(x=>({id:'tree-'+x.id,source:x.parentId,target:x.id,type:layoutMode==='free'?'bezier':'smoothstep',markerEnd:{type:MarkerType.ArrowClosed,width:12,height:12,color:'#667d99'},style:{stroke:'#667d99',strokeWidth:1.7}})),...links.filter(l=>ids.has(l.source)&&ids.has(l.target)).map(l=>({id:l.id,source:l.source,target:l.target,type:'bezier',animated:true,style:{stroke:'#d4a768',strokeWidth:2,strokeDasharray:'6 4'}}))],[visible,ids,links,layoutMode]);
 const connect=useCallback(params=>{if(params.source&&params.target)onConnect(params.source,params.target);},[onConnect]);
 return <div className="canvas"><ReactFlow fitView fitViewOptions={{padding:.18}} nodes={nodes} edges={edges} nodeTypes={nodeTypes} onConnect={connect} nodesConnectable elementsSelectable panOnDrag panOnScroll={false} zoomOnPinch zoomOnDoubleClick minZoom={.1} maxZoom={3} onNodeClick={(_,n)=>onSelect(n.id)} onPaneClick={()=>onSelect(null)} onNodeDragStop={(_,n)=>onMove(n.id,n.position)} deleteKeyCode={null}><Background color="#29364c" gap={24}/><MiniMap className="planner-minimap" zoomable pannable nodeColor="#597ca6" style={{background:'#151f30',border:'1px solid #334256',width:145,height:100}} maskColor="rgba(13,19,30,.55)"/><Controls showInteractive={false}/></ReactFlow></div>;
}
