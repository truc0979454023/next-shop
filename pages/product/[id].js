import { useState, useContext } from 'react'
import Head from 'next/head'
import { getData } from '../../utils/fetchData'
import { DataContext } from '../../store/GlobalState'
import { addToCart } from '../../store/Actions'

const DetailProduct = (props) => {


    const [product] = useState(props.product)
    const [tab, setTab] = useState(0)

    const {state, dispatch} = useContext(DataContext)
    const { cart } = state

    //Cách để có hiệu ứng khung vàng khi chuyển image
    const isActive = (index) => {
        if (tab === index) return "active"
    }

    //Cách khác
    //UseRef Hook là một hàm trả về một đối tượng ref có thể thay đổi có thuộc tính
    //const imgRef = useRef()
    //Khi onClick tab thay đổi useEffect sẽ render sẽ refresh lại 
    //class của các image và đặt lại class mới
    // useEffect(() => {
    //     const images = imgRef.current.children;
    //     // Bỏ className active của các image bằng class img-thumbnail rounded
    //     for (let i = 0; i < images.length; i++) {
    //         console.log(images[i].className)

    //         images[i].className = images[i].className.replace("active", "img-thumbnail rounded")
    //     }
    //     //Riêng image[tab](đc click) sẽ đc add class active
    //     images[tab].className = "img-thumbnail rounded active";
    // }, [tab])

    return (
        <div className="row detail_page">
            <Head>
                <title>Detail Product</title>
            </Head>

            <div className="col-md-6">
                <img src={product.images[tab].url} alt={product.images[tab].url}
                    className="d-block img-thumbnail rounded mt-4 w-100"
                    style={{ height: '350px' }} />

                {/*Thêm ref={imgRef}* vào thẻ div dưới nếu muốn sdung c2*/}
                <div className="row mx-0" style={{ cursor: 'pointer' }} >
                    {
                        product.images.map((image, index) => (
                            <img key={index} src={image.url} alt={image.url}
                                className={`img-thumbnail rounded ${isActive(index)}`}
                                style={{ height: '80px', width: '20%' }}
                                onClick={() => setTab(index)} />
                        ))
                    }
                </div>
            </div>

            <div className="col-md-6 mt-3">
                <h3 className="text-uppercase  " >
                    {product.title}
                </h3>
                <h5 className="text-danger">
                    <p className="text-secondary" style={{ display: 'inline-block', marginBottom: 0, fontWeight: '600' }}>Price:&nbsp;</p>
                    ${product.price}
                </h5>

                <div className="row mx-0 d-flex justify-content-between">
                    {
                        product.inStock > 0
                            ? <h6 className="text-danger">
                                <p className="text-secondary" style={{ display: 'inline-block', marginBottom: 0, fontWeight: '600' }}>In Stock:&nbsp;</p>
                                {product.inStock}
                            </h6>
                            : <h6 className="text-danger">
                                <p className="text-secondary" style={{ display: 'inline-block', marginBottom: 0, fontWeight: '600' }}>Out Stock:&nbsp;</p>
                            </h6>
                    }
                    <h6 className="text-danger">
                        <p className="text-secondary" style={{ display: 'inline-block', marginBottom: 0, fontWeight: '600' }}>Sold:&nbsp;</p>
                        {product.sold}
                    </h6>
                </div>

                <div className="my-2 text-secondary" >
                    <p style={{ display: 'inline-block', marginBottom: 0, fontWeight: '600' }}>Description:&nbsp;</p>
                    {product.description}
                </div>
                <div className="my-2 text-secondary">
                    <p style={{ display: 'inline-block', marginBottom: 0, fontWeight: '600' }}>Content:&nbsp;</p>
                    {product.content}
                </div>
                <button type="button" className="btn btn-dark d-block my-3 px-5"
                    onClick={() => dispatch(addToCart(product, cart))}>
                    Buy
                </button>
            </div>
        </div>
    )
}


//nextjs support getServerSideProps
export async function getServerSideProps({ params: { id } }) {
    //lây dữ liệu từ api/product/[id]
    const res = await getData(`product/${id}`)
    //server side rendering
    return {
        props: {
            product: res.product
        }, // will be passed to the page component as props
    }
}

export default DetailProduct