import { Card as MuiCard } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import GroupIcon from '@mui/icons-material/Group';
import CommentIcon from '@mui/icons-material/Comment';
import AttachmentIcon from '@mui/icons-material/Attachment';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function Card({ temporaryHideMedia }) {
    if (temporaryHideMedia) {
        return (
            <MuiCard
                sx={{
                    cursor: 'pointer',
                    boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
                    overflow: 'unset',
                }}
            >
                <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                    <Typography>Cars Test 01</Typography>
                </CardContent>
            </MuiCard>
        );
    }
    return (
        <MuiCard
            sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
                overflow: 'unset',
            }}
        >
            <CardMedia
                sx={{ height: 140 }}
                image="https://p16-sign-sg.tiktokcdn.com/tos-alisg-avt-0068/f6f14aefe7d3504ad9037940e83653d3~tplv-tiktokx-cropcenter:1080:1080.jpeg?dr=14579&refresh_token=96226477&x-expires=1755666000&x-signature=sIzEZQd6R2eazqa4UoAi612jK%2BY%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=81f88b70&idc=my2"
                title="green iguana"
            />
            <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography>Nguyen Minh Luan</Typography>
            </CardContent>
            <CardActions sx={{ p: '0 4px 8px 4px' }}>
                <Button size="small" startIcon={<GroupIcon />}>
                    20
                </Button>
                <Button size="small" startIcon={<CommentIcon />}>
                    15
                </Button>
                <Button size="small" startIcon={<AttachmentIcon />}>
                    25
                </Button>
            </CardActions>
        </MuiCard>
    );
}

export default Card;
