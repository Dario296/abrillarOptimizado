import React from 'react';
import Table from 'react-bootstrap/Table';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAuth } from '../../context/AdminContext';

const CartTable = ({ cartItems, removeFromCart, totalPrice, increaseQuantity, decreaseQuantity, totalPriceVF }) => {
	const { isAuthenticated } = useAuth();
	return (
		<Table bordered responsive>
			<thead>
				<tr>
					<th>Nombre</th>
					<th>Cantidad</th>
					<th>Total</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{cartItems.map((item) => (
					<tr key={item.ID}>
						<td>{item.nombre}</td>
						<td className='Flex'>
							{isAuthenticated ? null : (
								<IconButton className='Restar' onClick={() => decreaseQuantity(item.ID)}>
									<RemoveIcon />
								</IconButton>
							)}
							{item.cantidad}
							{isAuthenticated ? null : (
								<IconButton className='Sumar' onClick={() => increaseQuantity(item.ID)}>
									<AddIcon />
								</IconButton>
							)}
						</td>
						<td>${isAuthenticated ? item.precio : item.precio * item.cantidad}</td>
						<td>
							<IconButton className='Eliminar' onClick={() => removeFromCart(item.ID)}>
								<DeleteIcon />
							</IconButton>
						</td>
					</tr>
				))}
				<tr>
					<td colSpan='2'>
						<strong>Total:</strong>
					</td>
					<td>${isAuthenticated ? totalPriceVF() : totalPrice()}</td>
				</tr>
			</tbody>
		</Table>
	);
};

export default CartTable;
