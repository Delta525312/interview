
import { Play, Pause, RefreshCw, GitBranch, FileText, AlertTriangle, PlusCircle, Trash2, SlidersHorizontal, Keyboard, HelpCircle } from 'lucide-react';
import { Rnd } from 'react-rnd';
import React, { useState, useEffect, useContext } from 'react';
import { TreeNode, InputMode,LogEntry } from './types';
const BuilderLockContext = React.createContext<{isSimulating: boolean, isPaused: boolean}>({isSimulating: false, isPaused: false});

  //  parseAndValidateInput ตัวเเปลง rawinput เป็น walnuts, capacity, treeStruct ใช้ในหน้า render tree
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

//  buildTreeFromLegacyStruct โครงสร้างต้นไม้จาก string legacy struct เช่น "ABEG)H)))COHGB)))))DFIK)L))JM))))" node เเม่ไล่ไป node ลูก

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

//เอาไว้แปลงโครงสร้างข้อมูลต้นไม้กลับไปเป็น "raw string"
const serializeTreeToLegacy = (node: TreeNode): string => {
    let s = node.id;
    for (const child of node.children) {
        s += serializeTreeToLegacy(child);
    }
    return s + (node.parent ? ')' : '');
};



//ไว้สร้างสำเนาของโหนดต้นไม้
const deepCloneTree = (node: TreeNode, parent: TreeNode | null = null): TreeNode => {
    const newNode: TreeNode = { ...node, parent: parent, children: [] };
    newNode.children = node.children.map(child => deepCloneTree(child, newNode));
    return newNode;
};

//หน้าเเสดงผล โครงสร้างต้นไม้
interface TreeBuilderProps { node: TreeNode; onUpdate: (node: TreeNode) => void; path?: string[]; }
const TreeBuilderNode: React.FC<TreeBuilderProps> = ({ node, onUpdate, path = [] }) => {
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
        if (node.children.length >= 4) return; // Limit to 4 children
        let newChildId = String.fromCharCode('A'.charCodeAt(0) + Math.floor(Math.random() * 26));
        // ห้ามสร้างลูกที่ id เป็น 'A'
        while (newChildId === 'A') {
            newChildId = String.fromCharCode('A'.charCodeAt(0) + Math.floor(Math.random() * 26));
        }
        const newChild: TreeNode = { id: newChildId, children: [], parent: node, capacity: node.capacity, walnutsStored: 0, uid: crypto.randomUUID() };
        onUpdate({ ...node, children: [...node.children, newChild] });
    };
    // Recursively update a child node in the tree
    const updateChild = (tree: TreeNode, childUid: string, updatedChild: TreeNode): TreeNode => {
        if (tree.uid === childUid) return updatedChild;
        return { ...tree, children: tree.children.map(c => updateChild(c, childUid, updatedChild)) };
    };
    const handleChildUpdate = (updatedChild: TreeNode) => {
        if (locked) return;
        onUpdate(updateChild(node, updatedChild.uid, updatedChild));
    };
    // Remove a child node by uid
    const removeThisNode = () => {
        if (locked) return;
        if (!node.parent) return; // don't remove root
        // propagate up: parent must remove this node from its children
        const removeChild = (tree: TreeNode, childUid: string): TreeNode => {
            return { ...tree, children: tree.children.filter(c => c.uid !== childUid).map(c => removeChild(c, childUid)) };
        };
        if (node.parent) {
            onUpdate(removeChild(node.parent, node.uid));
        }
    };
    return (
      <div className="builder-node">
        <div className="builder-node-self">
          <input type="text" value={node.id} onChange={handleIdChange} className="builder-node-input" disabled={locked} />
          <button onClick={addChild} className="builder-node-btn add" title="Add child" disabled={locked || getDepth(node) >= 5 || node.children.length >= 4}><PlusCircle size={16} /></button>
          {node.parent && <button onClick={removeThisNode} className="builder-node-btn remove" title="Remove node" disabled={locked}><Trash2 size={16} /></button>}
        </div>
        {node.children.length > 0 && (
          <div className="builder-node-children">
            {node.children.map(child => (
              <TreeBuilderNode key={child.uid} node={child} onUpdate={handleChildUpdate} />
            ))}
          </div>
        )}
      </div>
    );
};

//ตัวควบคุมการสร้างต้นไม้ 
interface ControlsPanelProps { onUpdateInput: (walnuts: number, capacity: number, tree: TreeNode) => void; onStartPauseResume: () => void; onReset: () => void; isSimulating: boolean; isPaused: boolean; error: string | null; t: Function; initialValues: {walnuts: number, capacity: number, tree: TreeNode | null}; addLog: (msg: string, type?: "info" | "error" | "success") => void; }
const ControlsPanel: React.FC<ControlsPanelProps> = ({ onUpdateInput, onStartPauseResume, onReset, isSimulating, isPaused, error, t, initialValues, addLog }) => {
    const [mode, setMode] = useState<InputMode>('builder');
    const [walnuts, setWalnuts] = useState(initialValues.walnuts);
    const [capacity, setCapacity] = useState(Math.min(initialValues.capacity, 5));
    const [builderTree, setBuilderTree] = useState<TreeNode | null>(initialValues.tree);
    const [rawInput, setRawInput] = useState("25,3,ABEG)H)))COHGB)))))DFIK)L))JM))))");
    const { isSimulating: lockedSim, isPaused: lockedPaused } = useContext(BuilderLockContext);
    const locked = lockedSim || lockedPaused;

    // Help modal state
    const [showHelp, setShowHelp] = useState(false);

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

    // Theme-aware help modal content with X button
  const theme = localStorage.getItem('theme') || 'light';

const isDark = theme === 'dark';

const helpContent = (
    <div
        style={{
            width: '100%',
            height: '100%',
            background: isDark ? '#1f1f1f' : '#fff',
            color: isDark ? '#f5f5f5' : '#222',
            borderRadius: 12,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            padding: 0
        }}
    >
        <div
            className="help-modal-header"
            style={{
                width: '100%',
                minHeight: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                background: isDark ? '#1f1f1f' : '#fff',
                borderBottom: `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
                cursor: 'move',
                userSelect: 'none',
            }}
        >
            <span style={{ fontWeight: 600, fontSize: 18 }}>
                {t('squirrel.help.title', 'คู่มือการสร้างโครงสร้างต้นไม้กระรอก')}
            </span>
            <button
                onClick={() => setShowHelp(false)}
                title={t('squirrel.help.close', 'ปิดคู่มือ')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: isDark ? '#f5f5f5' : '#222',
                    fontSize: 20,
                    cursor: 'pointer',
                    padding: 0,
                    marginLeft: 8,
                    lineHeight: 1,
                    borderRadius: 4,
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.background = isDark ? '#444' : '#e0e0e0')}
                onMouseOut={e => (e.currentTarget.style.background = 'none')}
            >
                <span style={{ fontWeight: 700, fontSize: 22 }}>&times;</span>
            </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
                <li>{t('squirrel.help.maxWalnut', 'แต่ละโหนดเก็บ walnut ได้ไม่เกิน 5 ลูก')}</li>
                <li>{t('squirrel.help.maxChildren', 'แต่ละโหนดมีลูกได้ไม่เกิน 4 โหนด')}</li>
                <li>{t('squirrel.help.maxDepth', 'ความลึกของต้นไม้ไม่เกิน 5 ชั้น (root นับเป็นชั้นที่ 1)')}</li>
                <li>{t('squirrel.help.idRule', 'id ของแต่ละโหนดต้องเป็นตัวอักษรภาษาอังกฤษ A-Z (root ห้ามเป็น A)')}</li>
                <li>{t('squirrel.help.capacityRule', 'capacity (ความจุ) ของแต่ละโหนดต้องอยู่ระหว่าง 1 ถึง 5')}</li>
                <li>{t('squirrel.help.walnutRule', 'จำนวน walnut ทั้งหมดต้องไม่เกิน nodeCount x 5')}</li>
                <li>{t('squirrel.help.legacyInput', 'โครงสร้างแบบ raw ต้องใช้รูปแบบ: จำนวนwalnut,capacity,โครงสร้าง เช่น 25,3,ABEG)H)))')}</li>
            </ul>
            <p style={{ fontSize: 13, color: isDark ? '#aaa' : '#888', marginTop: 16 }}>
                {t('squirrel.help.note', 'หมายเหตุ: หากข้อมูลไม่ถูกต้องจะไม่สามารถเริ่ม simulation ได้')}
            </p>
        </div>
    </div>
);


    return (
        <div className="panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 className="section-header"><GitBranch size={16} /> {t('squirrel.controls.title')}</h3>
                <button onClick={() => setShowHelp(true)} title={t('squirrel.help.open', 'เปิดคู่มือ')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color, #4a90e2)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <HelpCircle size={20} /> {t('squirrel.help.button', 'คู่มือ')}
                </button>
            </div>
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

            {/* Help Modal */}
            {showHelp && (
                <Rnd
                    default={{ x: 100, y: 100, width: 440, height: 380 }}
                    minWidth={320}
                    minHeight={220}
                    bounds="window"
                    style={{ zIndex: 1000, background: 'transparent', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}
                    dragHandleClassName="help-modal-header"
                    enableResizing={{
                        top: true,
                        right: true,
                        bottom: true,
                        left: true,
                        topRight: true,
                        bottomRight: true,
                        bottomLeft: true,
                        topLeft: true,
                    }}
                >
                    {helpContent}
                </Rnd>
            )}
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