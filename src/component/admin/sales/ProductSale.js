import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import app from '../../config/firebase';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useCartAdminContext } from '../../context/CartAdminContext';

const db = getFirestore(app);

const ProductSale = ({ product }) => {
	const [quantity, setQuantity] = useState(null);
	const [quantityMoney, setQuantityMoney] = useState(null);
	const [productRef, setProductRef] = useState([]);
	const { addToCart } = useCartAdminContext();

	useEffect(() => {
		if (product.referencia) {
			const ProducRefDB = doc(db, 'ListadoProductos', product.referencia);
			getDoc(ProducRefDB).then((resp) => {
				const produc = resp.data();
				setProductRef(produc);
			});
		}
	}, [product.referencia]);

	const cost = product.referencia ? productRef.costo * product.unidades : product.costo;
	const porcent = product.porcentaje;
	const price = Math.ceil((cost + (cost * porcent) / 100) / 50) * 50;
	const stockDisponible = product.referencia ? Math.floor(productRef.stock / product.unidades) : product.stock.toFixed(2);

	const handleChangeQuantity = (e) => {
		const value = Number(e.target.value);
		setQuantity(value);
		setQuantityMoney(value * price);
	}; // Manejar el cambio en cantidad

	const handleChangeQuantityMoney = (e) => {
		const value = Number(e.target.value);
		const result = (value / price).toFixed(2);
		setQuantity(result);
		setQuantityMoney(value);
	}; // Manejar el cambio en cantidad de dinero

	const productSale = {
		ID: product.ID,
		nombre: product.nombre,
		cantidad: quantity,
		precioTotal: quantityMoney,
		IDRef: product.referencia || null,
	}; // Crear objeto productSale para agregar al carrito

	const isAgregarDisabled = () => {
		return stockDisponible === 0 || quantity <= 0 || quantityMoney <= 0 || stockDisponible < quantity;
	}; // Verificar si el botón de agregar debe estar deshabilitado

	return (
		<tr>
			<td>{product.nombre}</td>
			<td>{stockDisponible}</td>
			<td>{price}</td>
			<td>
				<input className='inputVentas' onChange={handleChangeQuantity} type='number' name='cantidad' value={quantity} />
			</td>
			<td>
				<input className='inputVentas' onChange={handleChangeQuantityMoney} type='number' name='precio' value={quantityMoney} disabled={product.categoria === 'ofertas'} />
			</td>
			<Button className={isAgregarDisabled() ? 'agregarVentasD' : 'agregarVentas'} onClick={() => addToCart(productSale)} disabled={isAgregarDisabled()}>
				<AddShoppingCartIcon />
			</Button>
		</tr>
	);
};

export default ProductSale;
