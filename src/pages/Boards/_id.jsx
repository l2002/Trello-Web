import Container from '@mui/material/Container';
import AppBar from '../../components/AppBar/AppBar';
import BoardBar from './BoardBar/BoardBar';
import BoardContent from './BoardContent/BoardContent';
import Box from '@mui/material/Box';
import { mockData } from '~/apis/mock-data';
import { useEffect, useState } from 'react';
import {
    createNewColumnAPI,
    createNewCardAPI,
    fetchBoardDetailsAPI,
    updateBoardDetailsAPI,
    updateColumnDetailsAPI,
    moveCardToDifferentColumnAPI,
    deleteColumnDetailsAPI,
} from '~/apis';
import { isEmpty } from 'lodash';
import { generatePlaceholderCard } from '~/utils/formatter';
import { mapOrder } from '~/utils/sorts';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';
import { toast } from 'react-toastify';

function Board() {
    const [board, setBoard] = useState(null);

    useEffect(() => {
        const boardId = '68eca01cc8723242beedb2e8';
        // call API
        fetchBoardDetailsAPI(boardId).then((board) => {
            // Sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con
            board.columns = mapOrder(board.columns, board.columnOrderIds, '_id');

            board.columns.forEach((column) => {
                // Khi refresh web Cần xử lý kéo thả vào một column rỗng
                if (isEmpty(column.cards)) {
                    column.cards = [generatePlaceholderCard(column)];
                    column.cardOrderIds = [generatePlaceholderCard(column)._id];
                } else {
                    // Sắp xếp thứ tự các cards luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con
                    column.cards = mapOrder(column.cards, column?.cardOrderIds, '_id');
                }
            });
            console.log(board);
            setBoard(board);
        });
    }, []);

    // Gọi API tạo mới Column và làm lại dữ liệu state board
    const createNewColumn = async (newColumnData) => {
        const createdColumn = await createNewColumnAPI({
            ...newColumnData,
            boardId: board._id,
        });

        // Khi tạo column mới thì sẽ chưa có card, cần xử lý vấn đề kéo thả vào một column rỗng
        createdColumn.cards = [generatePlaceholderCard(createdColumn)];
        createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id];

        // Update state board
        const newBoard = { ...board };
        newBoard.columns.push(createdColumn);
        newBoard.columnOrderIds.push(createdColumn._id);
        setBoard(newBoard);
    };

    // Gọi API tạo mới Card và làm lại dữ liệu state board
    const createNewCard = async (newCardData) => {
        const createdCard = await createNewCardAPI({
            ...newCardData,
            boardId: board._id,
        });

        const newBoard = { ...board };
        const columnToUpdate = newBoard.columns.find((column) => column._id === createdCard.columnId);
        if (columnToUpdate) {
            // Nếu column rỗng: bản chất là đang chứa một cái Placeholder card
            if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
                columnToUpdate.cards = [createdCard];
                columnToUpdate.cardOrderIds = [createdCard._id];
            } else {
                // Ngược lại Column đã có data thì push vào cuối mảng
                columnToUpdate.cards.push(createdCard);
                columnToUpdate.cardOrderIds.push(createdCard._id);
            }
        }
        setBoard(newBoard);
    };

    // Gọi API và xử lý khi kéo thả Column xong xuôi
    // Chỉ cần gọi API để cập nhật mảng columnOrderIds của Board chứa nó (thay đổi vị trí trong board)
    const moveColumns = (dndOrderedColumns) => {
        // Update cho chuan du lieu state board
        const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
        const newBoard = { ...board };
        newBoard.columns = dndOrderedColumns;
        newBoard.columnOrderIds = dndOrderedColumnsIds;
        setBoard(newBoard);

        // Call API update board
        updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds });
    };

    // Khi di chuyển card trong cùng Column:
    // Chỉ cần gọi API để cập nhật mảng cardOrderIds của Column chứa nó (thay đổi vị trí trong mảng)
    const moveCardOnTheSameColumn = (dndOderedCards, dndOderedCardIds, columnId) => {
        // Update cho chuan du lieu state board
        const newBoard = { ...board };
        const columnToUpdate = newBoard.columns.find((column) => column._id === columnId);
        if (columnToUpdate) {
            columnToUpdate.cards = dndOderedCards;
            columnToUpdate.cardOrderIds = dndOderedCardIds;
        }
        setBoard(newBoard);

        // Call API update Column
        updateColumnDetailsAPI(columnId, { cardOrderIds: dndOderedCardIds });
    };

    const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
        // Update cho chuan du lieu state board
        const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
        const newBoard = { ...board };
        newBoard.columns = dndOrderedColumns;
        newBoard.columnOrderIds = dndOrderedColumnsIds;
        setBoard(newBoard);

        // Call API xu ly BE
        let prevCardOrderIds = dndOrderedColumns.find((c) => c._id === prevColumnId)?.cardOrderIds;
        // Xử lý vấn đề khi kéo phần tử cuối cùng ra khỏi column, Column rỗng sẽ có placeholder card, cần xóa nó đi trước khi gửi dữ liệu cho phía BE
        if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = [];

        moveCardToDifferentColumnAPI({
            currentCardId,
            prevColumnId,
            prevCardOrderIds,
            nextColumnId,
            nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)?.cardOrderIds,
        });
    };

    // Xử lý xóa một Column và Cards bên trong nó
    const deleteColumnDetails = (columnId) => {
        console.log('🚀 ~ deleteColumnDetails ~ columnId:', columnId);
        // Update cho chuan du lieu state board
        const newBoard = { ...board };
        newBoard.columns = newBoard.columns.filter((c) => c._id !== columnId);
        newBoard.columnOrderIds = newBoard.columnOrderIds.filter((_id) => _id !== columnId);
        setBoard(newBoard);

        // Goi API xu ly phia BE
        deleteColumnDetailsAPI(columnId).then((res) => {
            toast.success(res?.deleteResult);
        });
    };

    if (!board) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    width: '100vw',
                    height: '100vh',
                }}
            >
                <CircularProgress />
                <Typography>Loading Board...</Typography>
            </Box>
        );
    }

    return (
        <Container disableGutters maxWidth sx={{ height: '100vh' }}>
            <AppBar />
            <BoardBar board={board} />
            <BoardContent
                board={board}
                createNewColumn={createNewColumn}
                createNewCard={createNewCard}
                moveColumns={moveColumns}
                moveCardOnTheSameColumn={moveCardOnTheSameColumn}
                moveCardToDifferentColumn={moveCardToDifferentColumn}
                deleteColumnDetails={deleteColumnDetails}
            />
        </Container>
    );
}

export default Board;
