import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import { Badge, Button, IconButton, Typography } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%'
	},
	heading: {
		display: 'flex',
		direction: 'column',
		alignItems: 'center',
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightRegular
	},
	content: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	accordion: {
		marginBottom: '16px',
		width: '100%'
	},
	detail: {
		maxHeight: '200px',
		overflow: 'auto',
		display: 'flex',
		flexDirection: 'column'
	},
	badge: {
		width: '100%'
	},
	unfollowButton: {
		[theme.breakpoints.down('xs')]: {
			display: 'none'
		}
	},
	buttonIcon: {
		[theme.breakpoints.up('sm')]: {
			display: 'none'
		}
	}
}));

export function LocalRepoDisplay({ listRepo, removeRepo, setSeen }) {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			{listRepo.map(repoData => {
				console.log(repoData);
				return (
					<Badge
						key={repoData.repo}
						classes={{ root: classes.badge }}
						badgeContent={'new'}
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'left'
						}}
						invisible={repoData.seen}
						color="secondary">
						<Accordion
							onChange={(event, expanded) => setSeen(repoData.repo, repoData.owner)}
							classes={{ root: classes.accordion }}>
							<AccordionSummary
								classes={{ content: classes.content }}
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel2a-content"
								id="panel2a-header">
								<div className={classes.heading}>
									{`${repoData.repo} - ${repoData.owner} - ${repoData.tag_name} - ${
										repoData.published_at.split('T')[0]
									}`}
								</div>
								<div>
									<IconButton
										aria-label="delete"
										onClick={event => {
											event.stopPropagation();
											removeRepo(repoData.repo, repoData.owner);
										}}
										className={classes.buttonIcon}
										color="secondary">
										<CancelIcon fontSize="inherit" />
									</IconButton>
									<Button
										variant="contained"
										color="secondary"
										className={classes.unfollowButton}
										onClick={event => {
											event.stopPropagation();
											removeRepo(repoData.repo, repoData.owner);
										}}>
										Unfollow
									</Button>
								</div>
							</AccordionSummary>
							<AccordionDetails classes={{ root: classes.detail }}>
								<Typography>{`${repoData.repo} Releases Notes`}</Typography>
								<Typography>{repoData.body}</Typography>
							</AccordionDetails>
						</Accordion>
					</Badge>
				);
			})}
		</div>
	);
}

export default React.memo(LocalRepoDisplay);
