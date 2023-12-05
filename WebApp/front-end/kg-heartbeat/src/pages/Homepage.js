import KGimg from '../img/kg.png'
import IsisLab from '../img/isislab.jpg'
function Homepage() {

    return(
        <div className="container mt-5">
            <div className="row">
            <div className="col-md-3">
                <img
                src={KGimg}
                alt="KG_image"
                style={{ width: '290px', height: '210px' }}
                className="img-fluid mx-auto my-3"
                />
            </div>
            <div className="col-md-6">
                <p className="fs-5">
                Welcome to the KGHeartbeat Web-App. KGHeartBeat is a community-shared open-source knowledge graph quality assessment tool to perform quality analysis on a wide range of freely available knowledge graphs registered on the LOD cloud and DataHub. Through this web app you can directly view the quality data collected through charts and tables, or you can also directly download the data from the analysis performed by us. A new measurement will be added each week!
                Click on Search from the navigation bar to start exploring the quality of the knowledge graphs analyzed!
                </p>
            </div>
            </div>
            <div className="fixed-bottom text-center">
            <img
            src={IsisLab}
            alt="isis_lab_img"
            style={{ width: '200px', height: '150px' }}
            className="img-fluid mx-auto my-3"
            />
            <p className="fs-6">Gabriele Tuozzo, Maria Angela Pellegrino</p>
        </div>
      </div>
    );
}

export default Homepage;