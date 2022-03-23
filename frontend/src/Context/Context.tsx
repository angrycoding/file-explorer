import React from 'react';
import io, { Socket } from 'socket.io-client';


export interface FSItem {
	isDir: boolean;
	children: FSItems;
}


type FSItems = { [key: string]: FSItem; } 


interface Props {
	
}

interface State {
	isLoading: boolean;
	structure:  FSItems;
	loadChildren: (path: string) => void;
	unloadChildren: (path: string) => void
}

const defaultContext: State = {
	isLoading: true,
	structure: {},
	loadChildren: () => {},
	unloadChildren: () => {},
};

export const Context = React.createContext<State>(defaultContext);


const findContextNode = (path: string, target: FSItems): FSItems | null => {
	if (target[path]) return target;
	for (let ctxPath in target) {
		if (!path.startsWith(ctxPath)) continue;
		const children = target[ctxPath].children;
		if (children) return findContextNode(path, children);
		break;
	}
	return null;
};

const removeNode = (path: string, target: FSItems) => {
	const contextNode = findContextNode(path, target);
	if (contextNode) delete contextNode[path];
};

const setChildren = (path: string, target: FSItems, children: FSItems) => {
	const contextNode = findContextNode(path, target);
	if (contextNode) contextNode[path].children = children;
};

const addChildNode = (path: string, target: FSItems, childInfo: FSItems) => {
	const contextNode = findContextNode(path, target);
	if (contextNode) {
		if (!contextNode[path].children) {
			contextNode[path].children = childInfo;
		} else {
			contextNode[path].children = Object.assign(contextNode[path].children, childInfo);
		}
	}
};

export default class ContextProcessor extends React.Component<Props, State> {

	socket: Socket | null = null;


	constructor(props: Props) {
		super(props);
		this.loadChildren = this.loadChildren.bind(this);
		this.unloadChildren = this.unloadChildren.bind(this);
		this.state = {
			...defaultContext,
			loadChildren: this.loadChildren,
			unloadChildren: this.unloadChildren
		};
	}

	componentDidMount() {
		this.socket = io(`//localhost:9999`);

		this.socket.on('remove', (path) => {
			removeNode(path, this.state.structure);
			this.setState({ structure: this.state.structure })
		})

		this.socket.on('add', (path, isDir) => {
			const parentDir = path.split('/').slice(0, -1).join('/');
			
			addChildNode(parentDir, this.state.structure, {
				[path]: {
					isDir: isDir,
					children: {}
				}
			});

			this.setState({ structure: this.state.structure })
		})

		this.socket.emit('preload', '/', (fsItems: FSItems) => {
			this.setState({
				isLoading: false,
				structure: fsItems
			});
		});
	}





	loadChildren(path: string) {
		if (!this.socket) return;
		this.socket.emit('preload', path, (fsItems: FSItems) => {
			setChildren(path, this.state.structure, fsItems);
			this.setState({ structure: this.state.structure })
		});
	}


	unloadChildren(path: string) {
		setChildren(path, this.state.structure, {});
		this.setState({ structure: this.state.structure })
	}

	
	render() {
		return <Context.Provider value={this.state}>
			{this.props.children}			
		</Context.Provider>;
	}


}