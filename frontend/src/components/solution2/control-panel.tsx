
import { Play, Pause, RefreshCw, GitBranch, FileText, AlertTriangle, PlusCircle, Trash2, SlidersHorizontal, Keyboard } from 'lucide-react';
import React, { useState, useEffect, useContext } from 'react';
import { TreeNode, InputMode,LogEntry } from './types';

const BuilderLockContext = React.createContext<{isSimulating: boolean, isPaused: boolean}>({isSimulating: false, isPaused: false});
const parseAndValidateInput = (input: string, t: Function) => {
    const parts = input.split(',');
    if (parts.length < 2) throw new Error(t('squirrel.error.invalidFormat'));
    const walnuts = parseInt(parts[0], 10);
    const capacity = parseInt(parts[1], 10);
    const treeStruct = parts.slice(2).join(',');
    if (isNaN(walnuts) || walnuts < 0) throw new Error(t('squirrel.error.invalidWalnut'));
    if (isNaN(capacity) || capacity <= 0) throw new Error(t('squirrel.error.invalidCapacity'));
    if (!treeStruct) throw new Error(t('squirrel.error.invalidTreeStruct'));
    return { walnuts, capacity, treeStruct };
};

const buildTreeFromLegacyStruct = (struct: string, capacity: number, t: Function): TreeNode => {
    if (!struct || !/[a-zA-Z]/.test(struct[0])) throw new Error(t('squirrel.error.invalidTreeStruct'));
    const root: TreeNode = { id: struct[0], children: [], parent: null, capacity: 0, walnutsStored: 0, uid: crypto.randomUUID() };
    let currentNode: TreeNode = root;
    const nodeStack: TreeNode[] = [root];

    for (let i = 1; i < struct.length; i++) {
        const char = struct[i];
        if (/[a-zA-Z]/.test(char)) {
            const newNode: TreeNode = { id: char, children: [], parent: currentNode, capacity, walnutsStored: 0, uid: crypto.randomUUID() };
            currentNode.children.push(newNode);
            currentNode = newNode;
            nodeStack.push(currentNode);
        } else if (char === ')') {
            nodeStack.pop();
            if (nodeStack.length === 0) throw new Error(t('squirrel.error.impossibleTree'));
            currentNode = nodeStack[nodeStack.length - 1];
        }
    }
    return root;
};

const serializeTreeToLegacy = (node: TreeNode): string => {
    let s = node.id;
    for (const child of node.children) {
        s += serializeTreeToLegacy(child);
    }
    return s + (node.parent ? ')' : '');
};

const getPathForNode = (node: TreeNode): string => {
    let path = '';
    let current: TreeNode | null = node;
    while (current) { path = current.id + path; current = current.parent; }
    return path;
};


const deepCloneTree = (node: TreeNode, parent: TreeNode | null = null): TreeNode => {
    const newNode: TreeNode = { ...node, parent: parent, children: [] };
    newNode.children = node.children.map(child => deepCloneTree(child, newNode));
    return newNode;
};

interface TreeBuilderProps { node: TreeNode; onUpdate: (node: TreeNode) => void; }
const TreeBuilderNode: React.FC<TreeBuilderProps> = ({ node, onUpdate }) => {
    // Helper: get depth
    const getDepth = (n: TreeNode, d = 1): number => n.parent ? getDepth(n.parent, d + 1) : d;
    // ห้ามแก้ไขขณะเล่น
    const { isSimulating, isPaused } = useContext(BuilderLockContext);
    const locked = isSimulating || isPaused;
    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (locked) return;
        const newId = e.target.value.toUpperCase().slice(0, 1);
        if (/[A-Z]/.test(newId) || newId === '') onUpdate({ ...node, id: newId });
    };
    const addChild = () => {
        if (locked) return;
        if (getDepth(node) >= 5) return;
        let newChildId = String.fromCharCode('A'.charCodeAt(0) + Math.floor(Math.random() * 26));
        // ห้ามสร้างลูกที่ id เป็น 'A'
        while (newChildId === 'A') {
            newChildId = String.fromCharCode('A'.charCodeAt(0) + Math.floor(Math.random() * 26));
        }
        const newChild: TreeNode = { id: newChildId, children: [], parent: node, capacity: node.capacity, walnutsStored: 0, uid: crypto.randomUUID() };
        onUpdate({ ...node, children: [...node.children, newChild] });
    };
    const handleChildUpdate = (updatedChild: TreeNode) => {
        if (locked) return;
        onUpdate({ ...node, children: node.children.map(c => c.uid === updatedChild.uid ? updatedChild : c) });
    };
    const removeThisNode = () => {
        if (locked) return;
        if (node.parent) {
            const parent = node.parent;
            const newChildren = parent.children.filter(c => c.uid !== node.uid);
            onUpdate({ ...parent, children: newChildren });
        }
    };
    return (<div className="builder-node"><div className="builder-node-self"><input type="text" value={node.id} onChange={handleIdChange} className="builder-node-input" disabled={locked} /><button onClick={addChild} className="builder-node-btn add" title="Add child" disabled={locked || getDepth(node) >= 5}><PlusCircle size={16} /></button>{node.parent && <button onClick={removeThisNode} className="builder-node-btn remove" title="Remove node" disabled={locked}><Trash2 size={16} /></button>}</div>{node.children.length > 0 && <div className="builder-node-children">{node.children.map(child => <TreeBuilderNode key={child.uid} node={child} onUpdate={handleChildUpdate} />)}</div>}</div>);
};

interface ControlsPanelProps { onUpdateInput: (walnuts: number, capacity: number, tree: TreeNode) => void; onStartPauseResume: () => void; onReset: () => void; isSimulating: boolean; isPaused: boolean; error: string | null; t: Function; initialValues: {walnuts: number, capacity: number, tree: TreeNode | null}; addLog: (msg: string, type?: "info" | "error" | "success") => void; }
const ControlsPanel: React.FC<ControlsPanelProps> = ({ onUpdateInput, onStartPauseResume, onReset, isSimulating, isPaused, error, t, initialValues, addLog }) => {
    const [mode, setMode] = useState<InputMode>('builder');
    const [walnuts, setWalnuts] = useState(initialValues.walnuts);
    const [capacity, setCapacity] = useState(Math.min(initialValues.capacity, 5));
    const [builderTree, setBuilderTree] = useState<TreeNode | null>(initialValues.tree);
    const [rawInput, setRawInput] = useState("25,3,ABEG)H)))COHGB)))))DFIK)L))JM))))");
    const { isSimulating: lockedSim, isPaused: lockedPaused } = useContext(BuilderLockContext);
    const locked = lockedSim || lockedPaused;

    useEffect(() => {
        setWalnuts(initialValues.walnuts);
        setCapacity(Math.min(initialValues.capacity, 5));
        setBuilderTree(initialValues.tree);
    }, [initialValues]);

    useEffect(() => {
        if (builderTree) {
            const legacyStruct = serializeTreeToLegacy(builderTree);
            const newRawInput = `${walnuts},${capacity},${legacyStruct}`;
            setRawInput(newRawInput);
            onUpdateInput(walnuts, capacity, builderTree);
        }
    }, [walnuts, capacity, builderTree, onUpdateInput]);

    const handleRawInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (locked) return;
        const newRawInput = e.target.value;
        setRawInput(newRawInput);
        try {
            const { walnuts, capacity, treeStruct } = parseAndValidateInput(newRawInput, t);
            if (capacity < 1 || capacity > 5) throw new Error('Capacity must be between 1 and 5');
            const newTree = buildTreeFromLegacyStruct(treeStruct, Math.min(capacity, 5), t);
            setWalnuts(walnuts);
            setCapacity(Math.min(capacity, 5));
            setBuilderTree(newTree);
            onUpdateInput(walnuts, Math.min(capacity, 5), newTree);
        } catch (err: any) {
            addLog(err.message, 'error');
        }
    };
    
    const getStartButton = () => {
        if (!isSimulating) return <><Play size={18} /> {t('squirrel.controls.start')}</>;
        if (isPaused) return <><Play size={18} /> {t('squirrel.controls.resume')}</>;
        return <><Pause size={18} /> {t('squirrel.controls.pause')}</>;
    };

    // Node count
    const countNodes = (n: TreeNode): number => 1 + n.children.reduce((acc, c) => acc + countNodes(c), 0);
    const nodeCount = builderTree ? countNodes(builderTree) : 0;
    // ห้ามกรอก walnut > nodeCount*5
    const handleWalnutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (locked) return;
        const val = Math.max(0, parseInt(e.target.value) || 0);
        if (val > nodeCount * 5) return;
        setWalnuts(val);
    };
    // ห้าม capacity > 5
    const updateTreeCapacity = (tree: TreeNode | null, newCapacity: number): TreeNode | null => {
        if (!tree) return null;
        const updateNode = (node: TreeNode): TreeNode => ({
            ...node,
            capacity: newCapacity,
            children: node.children.map(updateNode)
        });
        return updateNode(tree);
    };
    const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (locked) return;
        let val = parseInt(e.target.value) || 1;
        if (val < 1) val = 1;
        if (val > 5) val = 5;
        setCapacity(val);
        setBuilderTree(prev => updateTreeCapacity(prev, val));
    };
    return (
        <div className="panel">
            <h3 className="section-header"><GitBranch size={16} /> {t('squirrel.controls.title')}</h3>
            <div className="mode-selector">
                <button onClick={() => !locked && setMode('builder')} className={mode === 'builder' ? 'active' : ''} disabled={locked}><SlidersHorizontal size={14}/> {t('squirrel.controls.mode.builder')}</button>
                <button onClick={() => !locked && setMode('raw')} className={mode === 'raw' ? 'active' : ''} disabled={locked}><Keyboard size={14}/> {t('squirrel.controls.mode.raw')}</button>
            </div>
            {mode === 'builder' ? (
                <div className="builder-ui">
                    <div className="builder-field"><label>{t('squirrel.controls.walnuts')}</label><input type="number" value={walnuts} onChange={handleWalnutChange} disabled={locked} /></div>
                    <div className="builder-field"><label>{t('squirrel.controls.capacity')}</label><input type="number" value={capacity} onChange={handleCapacityChange} disabled={locked} min={1} max={5} /></div>
                    <div className="builder-field"><label>{t('squirrel.controls.treeStructure')}</label><div className="builder-tree-container">{builderTree && <TreeBuilderNode node={builderTree} onUpdate={setBuilderTree} />}</div></div>
                </div>
            ) : <textarea className="input-textarea" value={rawInput} onChange={handleRawInputChange} rows={5} disabled={locked} />}
            <div className="action-buttons">
                <button className="control-button play" onClick={onStartPauseResume}>{getStartButton()}</button>
                <button className="control-button reset" onClick={onReset}><RefreshCw size={18} /> {t('squirrel.controls.reset')}</button>
            </div>
            {error && <div className="error-box"><AlertTriangle size={20} /> <span>{error}</span></div>}
        </div>
    );
}

interface ActivityLogProps { logs: LogEntry[]; onClear: () => void; t: Function; }
const ActivityLog: React.FC<ActivityLogProps> = ({ logs, onClear, t }) => (
    <div className="panel log-panel">
        <div className="log-header"><h3 className="section-header" style={{ borderBottom: 'none', marginBottom: 0 }}><FileText size={16} /> {t('squirrel.log.title')}</h3><button className="clear-button" onClick={onClear}>{t('squirrel.log.clear')}</button></div>
        <div className="log-content">{logs.map((log, i) => <div key={i} className={`log-entry ${log.type}`}><strong>{log.timestamp}</strong>: {log.message}</div>)}</div>
    </div>
);

export { ControlsPanel, ActivityLog };