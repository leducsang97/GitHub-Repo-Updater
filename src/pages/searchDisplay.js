import React from 'react';
import { Box, Paper, makeStyles, Typography, Button } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		width: '100%',
		flexWrap: 'nowrap',
		[theme.breakpoints.down('xs')]: {
			flexDirection: 'column'
		}
	},
	repoInfo: {
		flexShrink: 0,
		minWidth: '200px',
		padding: '8px',
		margin: '8px',
		marginLeft: '0px'
	},
	repoDetails: {
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 3,
		maxHeight: '200px',
		overflow: 'auto',
		wordBreak: 'break-all',
		padding: '8px',
		marginRight: '0px',
		margin: '8px'
	},
	button: {
		backgroundColor: '#0cc7cc'
	}
}));

export const SearchDisplay = ({ data, buttonAction, buttonName }) => {
	const classes = useStyles();
	if (data) {
		return (
			<div className={classes.root}>
				<Paper className={classes.repoInfo}>
					<Box component="span" m={1} className={classes.display}>
						<Typography variant="h5">Search Result</Typography>
						<p>
							{data.repo} - {data.owner} - {data.tag_name}
						</p>
					</Box>
					<Button color="primary" variant="contained" onClick={buttonAction} className={classes.button}>
						{buttonName}
					</Button>
				</Paper>
				<Paper className={classes.repoDetails}>
					<Typography>{`${data.repo} Releases Notes`}</Typography>
					{data.body}
				</Paper>
			</div>
		);
	}
	return null;
};

SearchDisplay.propTypes = {
	owner: PropTypes.string,
	repo: PropTypes.string
};

export default React.memo(SearchDisplay);
