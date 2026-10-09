import {useMemo} from 'react';
import {ReactFlow,Background,Controls,MiniMap,MarkerType} from '@xyflow/react';
import PlannerNode from './PlannerNode.jsx';
import {visibleTree,progressFor} from '../lib/tree.js';
const nodeTypes={planner:PlannerNode};
export default function PlannerCanvas({items,onSelect,onMove,onAdd,onToggle,selectedId}){
const visible=useMemo(()=>visibleTree(items),[items]);
const visibleIds=useMemo(()=>new Set(visible.map(x=>x.id)),[visible]);
const nodes=useMemo(()=>visible.map(item=>({id:item.id,type:'planner',position:{x:item.x,y:item.y},data:{item,children:items.filter(x=>x.parentId===item.id).length,progress:progressFor(items,item.id),onAdd,onToggle},selected:selectedId===item.id})),[visible,items,selectedId,onAdd,onToggle]);
const edges=useMemo(()=>visible.filter(x=>x.parentId&&visibleIds.has(x.parentId)).map(x=>({id:'e-'+x.id,source:x.parentId,target:x.id,type:'smoothstep',markerEnd:{type:MarkerType.ArrowClosed,width:12,height:12,color:'#667d99'},style:{stroke:'#667d99',strokeWidth:1.7}})),[visible,visibleIds]);
return <div className="canvas"><ReactFlow fitView fitViewOptions={{padding:.25}} nodes={nodes} edges={edges} nodeTypes={nodeTypes} nodesConnectable={false} elementsSelectable panOnDrag minZoom={.15} maxZoom={2.5} onNodeClick={(_,n)=>onSelect(n.id)} onPaneClick={()=>onSelect(null)} onNodeDragStop={(_,n)=>onMove(n.id,n.position)} deleteKeyCode={null}><Background color="#29364c" gap={24}/><MiniMap zoomable pannable nodeColor="#597ca6" style={{background:'#151f30',border:'1px solid #334256'}} maskColor="rgba(13,19,30,.55)"/><Controls showInteractive={false}/></ReactFlow></div>;
}
