import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
// --- Lock context for builder ---

import { type AnimationStep, type TreeNode, type LogEntry } from '../../components/solution2/types';
import { useTranslation } from 'react-i18next';
import '../../components/solution2/squirrel-styles.css';
import { TreeVisualization } from '../../components/solution2/tree-display';
import { useTheme } from '../../contexts/ThemeContext';
import { ControlsPanel, ActivityLog } from '../../components/solution2/control-panel';
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

const simulateSquirrelJourney = (tree: TreeNode, totalWalnuts: number) => {
    const result: string[] = [];
    if (totalWalnuts === 0) return { result };
    const nodesToFill: TreeNode[] = [];
    const getNodesDfs = (node: TreeNode) => { if (node.parent) nodesToFill.push(node); node.children.forEach(getNodesDfs); };
    getNodesDfs(tree);
    let storedWalnuts = 0;
    while (storedWalnuts < totalWalnuts) {
        let holeFoundThisTrip = false;
        for (const node of nodesToFill) {
           if (node.walnutsStored < node.capacity && node.walnutsStored < 5) {
                node.walnutsStored++; storedWalnuts++;
                const path = getPathForNode(node);
                result.push(`${storedWalnuts}${path}`);
                holeFoundThisTrip = true; break;
            }
        }
        if (!holeFoundThisTrip) break;
    }
    return { result };
};

const deepCloneTree = (node: TreeNode, parent: TreeNode | null = null): TreeNode => {
    const newNode: TreeNode = { ...node, parent: parent, children: [] };
    newNode.children = node.children.map(child => deepCloneTree(child, newNode));
    return newNode;
};


// =================================================================================
// --- MAIN APP COMPONENT ---
// =================================================================================
export const SquirrelPage: React.FC = () => {
    const { t } = useTranslation();
    const { themeMode } = useTheme();
    const [isMuted, setIsMuted] = useState(false);
    const [walnuts, setWalnuts] = useState(25);
    const [capacity, setCapacity] = useState(3);
    const [simulationTree, setSimulationTree] = useState<TreeNode | null>(null);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSimulating, setIsSimulating] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [squirrelPosition, setSquirrelPosition] = useState<string | null>(null);
    const [walnutsAtRoot, setWalnutsAtRoot] = useState(0);
    const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const sounds = useRef<{ [key: string]: HTMLAudioElement }>({});
    const animationState = useRef<{ trips: string[], initialTree: TreeNode | null, tripIndex: number, stepIndex: number, sequence: AnimationStep[] }>({ trips: [], initialTree: null, tripIndex: 0, stepIndex: 0, sequence: [] });

    useEffect(() => {
        const savedMuted = localStorage.getItem('soundMuted') === 'true';
        setIsMuted(savedMuted);
        sounds.current = { walk: new Audio('/solution2/walk.mp3'), pick: new Audio('/solution2/pick.mp3'), drop: new Audio('/solution2/drop.mp3'), };
        Object.values(sounds.current).forEach(sound => { sound.load(); sound.volume = 0.7; });

        try {
            const { walnuts, capacity, treeStruct } = parseAndValidateInput("25,3,ABEG)H)))C)DFIK)L))JM))))", t);
            const initialTree = buildTreeFromLegacyStruct(treeStruct, capacity, t);
            setWalnuts(walnuts);
            setCapacity(capacity);
            setSimulationTree(initialTree);
        } catch (e) {
            console.error("Failed to parse initial tree structure:", e);
            setError(t('squirrel.error.impossibleTree'));
        }
    }, [t]);

    const playSound = useCallback((sound: 'walk' | 'pick' | 'drop') => {
        if (!isMuted && sounds.current[sound]) {
            sounds.current[sound].currentTime = 0;
            sounds.current[sound].play().catch(console.error);
        }
    }, [isMuted]);

    const addLog = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
        const timestamp = new Date().toLocaleTimeString('th-TH');
        setLogs(prev => [{ timestamp, message, type }, ...prev].slice(0, 100));
    };

    const handleReset = () => {
        if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
        setIsSimulating(false);
        setIsPaused(false);
        setError(null);
        setLogs([]);
        setSquirrelPosition(null);
        setWalnutsAtRoot(0);
        addLog(t('squirrel.log.reset'));
        
        try {
            const { walnuts, capacity, treeStruct } = parseAndValidateInput("25,3,ABEG)H)))C)DFIK)L))JM))))", t);
            const initialTree = buildTreeFromLegacyStruct(treeStruct, capacity, t);
            setWalnuts(walnuts);
            setCapacity(capacity);
            setSimulationTree(initialTree);
        } catch (e) {
             setError(t('squirrel.error.impossibleTree'));
        }
    };
    
    const findNodeByPath = useCallback((node: TreeNode, path: string): TreeNode | null => {
        if (getPathForNode(node) === path) return node;
        for (const child of node.children) { const found = findNodeByPath(child, path); if (found) return found; }
        return null;
    }, []);

    const processNextTrip = useCallback(() => {
        const state = animationState.current;
        if (state.tripIndex >= state.trips.length) {
            if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
            setIsSimulating(false); setSquirrelPosition(null); addLog(t('squirrel.log.complete'), 'success'); return;
        }
        const trip = state.trips[state.tripIndex];
        const path = trip.replace(/^\d+/, '');
        const pathNodes = path.split('');
        
        state.sequence = [];
        for (let i = 0; i < pathNodes.length; i++) state.sequence.push({ type: 'move', path: pathNodes.slice(0, i + 1).join('') });
        state.sequence.push({ type: 'pick', path: path });
        for (let i = pathNodes.length - 2; i >= 0; i--) state.sequence.push({ type: 'move', path: pathNodes.slice(0, i + 1).join('') });
        state.sequence.push({ type: 'drop' });
        state.stepIndex = 0;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        executeStep();
    }, [addLog, t]);
    
    const executeStep = useCallback(() => {
        const state = animationState.current;
        if (state.stepIndex >= state.sequence.length) {
            state.tripIndex++;
            processNextTrip();
            return;
        }
        const step = state.sequence[state.stepIndex];
        const node = step.path ? findNodeByPath(state.initialTree!, step.path) : state.initialTree;
        
        if (step.type === 'move') { setSquirrelPosition(node!.uid); playSound('walk'); } 
        else if (step.type === 'pick') {
            playSound('pick');
            setSimulationTree(currentTree => {
                const newTree = deepCloneTree(currentTree!);
                const nodeToUpdate = findNodeByPath(newTree, step.path!);
                if (nodeToUpdate) nodeToUpdate.walnutsStored--;
                return newTree;
            });
        } else if (step.type === 'drop') {
            setSquirrelPosition(state.initialTree!.uid); playSound('drop');
            setWalnutsAtRoot(prev => prev + 1);
           const logMessage = t('squirrel.log.storeWalnut').replace('{trip}', state.trips[state.tripIndex]); addLog(logMessage);
        }
        state.stepIndex++;
        animationTimeoutRef.current = setTimeout(executeStep, 500);
    }, [playSound, t, findNodeByPath, processNextTrip]);

    const handleStartPauseResume = () => {
        if (!isSimulating) { // Start
            if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
            setError(null); setLogs([]); setSquirrelPosition(null); setWalnutsAtRoot(0);
            setTimeout(() => {
                if (!simulationTree) { setError(t('squirrel.error.invalidTreeStruct')); addLog(t('squirrel.error.invalidTreeStruct'), 'error'); return; }
                try {
                    const simTree = deepCloneTree(simulationTree);
                    const { result } = simulateSquirrelJourney(simTree, walnuts);
                    setSimulationTree(simTree);
                    if (result.length > 0) {
                       addLog(
  `${t('squirrel.log.prefix')} ${walnuts} ${t('squirrel.log.middle')} ${capacity} ${t('squirrel.log.success')}`,
);

                        animationState.current = { trips: result, initialTree: simulationTree, tripIndex: 0, stepIndex: 0, sequence: [] };
                        setIsSimulating(true);
                        setIsPaused(false);
                        processNextTrip();
                    } else { addLog(t('squirrel.log.noWalnutsStored'), 'info'); }
                } catch (e: any) { setError(e.message); addLog(e.message, 'error'); }
            }, 50);
        } else { // Pause or Resume
            if (isPaused) { setIsPaused(false); executeStep(); } 
            else { setIsPaused(true); if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current); }
        }
    };
    
    const handleControlsUpdate = useCallback((newWalnuts: number, newCapacity: number, newTree: TreeNode) => {
        setWalnuts(newWalnuts);
        setCapacity(newCapacity);
        setSimulationTree(newTree);
    }, []);

    return (
        <BuilderLockContext.Provider value={{isSimulating, isPaused}}>
        <div data-theme={themeMode}>
            <div className="page-container">
                <div className="main-layout">
                    <ControlsPanel 
                        t={t} 
                        onUpdateInput={handleControlsUpdate} 
                        onStartPauseResume={handleStartPauseResume} 
                        onReset={handleReset} 
                        isSimulating={isSimulating}
                        isPaused={isPaused} 
                        error={error}
                        initialValues={{walnuts, capacity, tree: simulationTree}}
                        addLog={addLog}
                    />
                    <TreeVisualization t={t} tree={simulationTree} squirrelPosition={squirrelPosition} walnutsAtRoot={walnutsAtRoot} />
                    <ActivityLog t={t} logs={logs} onClear={() => setLogs([])} />
                </div>
            </div>
        </div>
        </BuilderLockContext.Provider>
    );
};

export default SquirrelPage;