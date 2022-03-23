import React from 'react';
import clsx from 'clsx';
import styles from './TreeView.module.scss';
import { Context, FSItem } from '../../Context/Context';
import TreeViewItem from '../TreeViewItem/TreeViewItem';

interface Props {}

interface State {}

export default class TreeView extends React.Component<Props, State> {

	static contextType = Context;
	context: React.ContextType<typeof Context>;

	constructor(props: Props, context: React.ContextType<typeof Context>) {
		super(props);
		this.state = {};
		this.context = context;
	}

	render() {
		return <div className={clsx(styles.wrapper, this.context.isLoading && styles.loading)}>
			{Object.entries(this.context.structure).map(entry => (
				<TreeViewItem key={entry[0]} path={entry[0]} fsItem={entry[1] as FSItem} level={0} />
			))}
		</div>
	}


}