import Container from '@mui/material/Container';
import AppBar from '../../components/AppBar/AppBar';
import BoardBar from './BoardBar/BoardBar';
import BoardContent from './BoardContent/BoardContent';
import { mockData } from '~/apis/mock-data';
import { useEffect, useState } from 'react';
import { createNewColumnAPI, createNewCardAPI, fetchBoardDetailsAPI, updateBoardDetailsAPI } from '~/apis';
import { isEmpty } from 'lodash';
import { generatePlaceholderCard } from '~/utils/formatter';

function Board() {
    const [board, setBoard] = useState(null);

    useEffect(() => {
        const boardId = '68de177d7983423e3a65654e';
        // call API
        fetchBoardDetailsAPI(boardId).then((board) => {
            // Khi refresh web Cần xử lý kéo thả vào một column rỗng
            board.columns.forEach((column) => {
                if (isEmpty(column.cards)) {
                    column.cards = [generatePlaceholderCard(column)];
                    column.cardOrderIds = [generatePlaceholderCard(column)._id];
                }
            });
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
            columnToUpdate.cards.push(createdCard);
            columnToUpdate.cardOrderIds.push(createdCard._id);
        }
        setBoard(newBoard);
    };

    const moveColumns = async (dndOrderedColumns) => {
        // Update cho chuan du lieu state board
        const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
        const newBoard = { ...board };
        newBoard.columns = dndOrderedColumns;
        newBoard.columnOrderIds = dndOrderedColumnsIds;
        setBoard(newBoard);

        // Call API update board
        await updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds });
    };

    return (
        <Container disableGutters maxWidth sx={{ height: '100vh' }}>
            <AppBar />
            <BoardBar board={board} />
            <BoardContent
                board={board}
                createNewColumn={createNewColumn}
                createNewCard={createNewCard}
                moveColumns={moveColumns}
            />
        </Container>
    );
}

export default Board;
