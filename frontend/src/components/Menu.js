import styles from "./css/Menu.module.css";
import React, { useState,useRef,useEffect } from 'react';
import { useSelector } from "react-redux";
import { useParams,useNavigate } from "react-router-dom";
import { selectToken } from "../app/redux/userSlice";
import BoardAPI from "../api/BoardAPI";
import Comment from "./board/Comment";
import hamburger from "../asset/img/hamburger.png";
import home from "../asset/img/home.png";
import logout from "../asset/img/logout.png";
import board from "../asset/img/board.png";
import photoUpload from "../asset/img/PhotoUpload.png";
import back from "../asset/img/back.png";
import Go from "../asset/img/Go.png";
import eximg from "../asset/img/eximg.png";
import nolike from "../asset/img/nolike.png";
import redlike from "../asset/img/redlike.png";
import boardBack from "../asset/img/boardBack.png";
import send from "../asset/img/send.png";

function Modal({ onClose }) {
  function handleClose() {
    onClose?.();
  }
  const token = useSelector(selectToken);

  const logOut = () => {
    localStorage.removeItem('persist:root');
    localStorage.removeItem('token');
    window.location.replace('/');
  }
  return (
    <div>
      {token === "" ?
      <div className={styles.Modal} onClick={handleClose}>
        <div className={styles.ModalBody} onClick={(e) => e.stopPropagation()}>
          <div>
            <svg
              className={styles.modalCloseBtn}
              onClick={handleClose}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="24" height="24" rx="12" fill="#E5E5E5" />
              <path
                d="M12 10.8891L15.8891 7L17 8.11094L13.1109 12L17 15.8891L15.8891 17L12 13.1109L8.11094 17L7 15.8891L10.8891 12L7 8.11094L8.11094 7L12 10.8891Z"
                fill="#4F4F4F"
              />
            </svg>
          </div>
          <div style={{ position: "absolute", left: "32px", top: "72px" }}>
            <p className={styles.ModalText}>?????? ???????????? ????????????????????????.</p>
          </div>
        </div>
      </div> : 
      <div className={styles.Modal} onClick={handleClose}>
      <div className={styles.LOModalBody} onClick={(e) => e.stopPropagation()}>
        <div>
          <svg
            className={styles.modalCloseBtn}
            onClick={handleClose}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="24" height="24" rx="12" fill="#E5E5E5" />
            <path
              d="M12 10.8891L15.8891 7L17 8.11094L13.1109 12L17 15.8891L15.8891 17L12 13.1109L8.11094 17L7 15.8891L10.8891 12L7 8.11094L8.11094 7L12 10.8891Z"
              fill="#4F4F4F"
            />
          </svg>
        </div>
        <div style={{ position: "absolute", left: "32px", top: "88px" }}>
          <p className={styles.ModalText}>
           ???????????? ???????????????????
          </p>
        </div>
        <div className={styles.buttonBox}>
          <button className={styles.NextButton} onClick={logOut}>
            Yes
          </button>
        </div>
      </div>
    </div>}
    </div>
    
  );
}

function Board({ onClose }) {
  function handleClose() {
    onClose?.();
  }

  const [boardInfo, setBoardInfo] = useState();
  function setTitle(title){
    setBoardInfo({
      ...boardInfo,
      title:title
    })
  }
  function setContent(content){
    setBoardInfo({
      ...boardInfo,
      content:content
    })
  }
  function setCategory(category){
    setBoardInfo({
      ...boardInfo,
      category:category
    });
    setSelected(category);
  }
  function setPicURL(picURL){
    setBoardInfo({
      ...boardInfo,
      picURL:picURL
    })
  }
  async function boardWrite(){
    const result=await BoardAPI.createBoard(boardInfo)
    if (result.data.message==="success" && boardInfo.category==="mission2"){
      setBoardNum('2')
    }
    
  }
  const { category } = useParams();
  const [boardList, setBoardList] = useState([]);
  const navigate=useNavigate()
  useEffect(() => {
    async function load() {
      const response=await BoardAPI.allBoard(category)
      const boardList=response.data.articleList
      setBoardList(boardList)
      console.log(boardList)
    }
    load();
  }, []);

  function Post({board}){
    console.log(board)
    return(
      <img className={styles.postImg} src={eximg} alt=""/>
    )
  }

  const { boardId } = useParams();
  const [commentList,setCommentList]=useState([]);
  const [comment,setComment]=useState('');
  const [likeState,setLikeState]=useState();
  const [boardDetail,setBoardDetail]=useState()

  const loadDetail=async (boardId)=>{
    const detailResponse=await BoardAPI.getBoardDetail(boardId)
    const info=detailResponse.data.board
    console.log(info)
    setLikeState(detailResponse.data.likeState)
    setBoardDetail(info)
    const commentListResponse=await BoardAPI.getComment(boardId)
    const commentList=commentListResponse.data.commentList
    setCommentList(commentList)
    console.log(commentList)
  }

  async function commentWrite(boardId){
    const body={
      content:comment
    }
    const result=await BoardAPI.createComment(boardId,body)
    setCommentList(result.data.commentList)
  }
  async function likeBoard(boardId){
    const result=await BoardAPI.likeBoard(boardId)
    setLikeState(result.data.state)
    console.log(result)
    
  }

  const options = [
    {value: '0', text: '??????2 ????????? ????????????'},
    {value: '3', text: '??????3 ?????? ????????????'},
  ];
  const [selected, setSelected] = useState(options[0].value);

  // ??????2 ???????????????????????? ?????????
  const [boardNum, setBoardNum] = useState('0');

  //?????? ????????? url??? ???????????? state
  const [good,setGood] = useState(photoUpload);
  const goodInput = useRef();
  const goodClick = () => {
    goodInput.current.click();
  };
  // ?????? ??????
  const saveGoodFileImage = (e) => {
    if (e.target.files[0] !== undefined){
      setGood(URL.createObjectURL(e.target.files[0]));
    } else { setGood(photoUpload) }
  };

  return (
      <div className={styles.Modal} onClick={handleClose}>
        <div className={styles.BoardBody} onClick={(e) => e.stopPropagation()}>
          <div>
            <svg
              className={styles.BoardCloseBtn}
              onClick={handleClose}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="24" height="24" rx="12" fill="#E5E5E5" />
              <path
                d="M12 10.8891L15.8891 7L17 8.11094L13.1109 12L17 15.8891L15.8891 17L12 13.1109L8.11094 17L7 15.8891L10.8891 12L7 8.11094L8.11094 7L12 10.8891Z"
                fill="#4F4F4F"
              />
            </svg>
          </div>

          {/* ??????2 ????????? ???????????? */}
          {boardNum==='0' ?
            <div className={styles.ListBox}>
              {/* ?????????????????? */}
              <div className={styles.CategoryBox}>
                <select className={styles.Category} value={selected} onChange={(e) => {
                      setSelected(e.target.value);
                      setBoardNum(e.target.value);
                  }}>
                {options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.text}
                  </option>
                ))}
                </select>
              </div>
                {/* ??? ??? ?????? */}
              <p onClick={()=>{setBoardNum('1');setCategory('mission2');}} className={styles.NewText}>+ ??? ??? ??????</p>
              <div className={styles.List}>
                {
                  boardList.map((board)=>{
                    if(board.category==="mission2"){
                      return(
                        <div 
                          key={board.id}
                          onClick={()=>{
                            loadDetail(board.id)
                            setBoardNum('2')
                          }} 
                        >
                          <Post 
                          board={board}
                          />
                        </div>
                      )
                    }
                    
                  })
                }
              </div>
            </div> 
            : null }

            {/*  ??????2 ??? ????????? ???????????? ????????? ?????? ??? */}
            {boardNum==='1' ?
            <div>
              <div className={styles.PhotoBox}>
                <img
                  onClick={goodClick}
                  className={styles.Photo}
                  src={good}
                  alt="sample"
                  />
                <input
                  type="file"
                  name="imgUpload"
                  accept="image/*"
                  onChange={saveGoodFileImage}
                  style={{ display: "none" }}
                  ref={goodInput}
                  />
              </div>
              <div className={styles.InputBox}>
                <p className={styles.InputCategory}>?????? : ??????2 ??? ????????? ????????????</p>
                <div>
                  <label className={styles.LabelFont} for="title">?????? : </label>
                  <input className={styles.InputTitle} id="title" 
                         onChange={(e) => {setTitle(e.target.value);}}
                         maxLength={25}/>
                </div>
                <div className={styles.ContextBox}>
                  <label className={styles.LabelFont} for="content">?????? : </label>
                  <textarea className={styles.InputContext} id="content" 
                            onChange={(e) => {setContent(e.target.value);}}
                            maxLength={1000}/>
                </div>
              </div>
              <img className={styles.backImg} src={back} alt="" onClick={()=>{setBoardNum('0');setSelected('0');}}/>
              <img className={styles.goImg} src={Go} alt="" 
                   onClick={()=>{boardWrite();}}/>
            </div>
              :null
            }

            {/* ??????2 ????????? ???????????? ??????????????? */}
            {boardNum==='2' && boardDetail ? 
              <div className={styles.DetailBox}>
                {console.log("boardDetail",boardDetail)}
                <img onClick={()=>{setBoardNum('0')}} className={styles.boardBack} src={boardBack} alt=""/>
                <p className={styles.detailTitle}>{boardDetail.title}</p>
                <div><img className={styles.detailImg} src={eximg} alt=""/></div>
                {likeState ? 
                  <div className={styles.heartBox}>
                    <img className={styles.heartImg} onClick={()=>likeBoard(boardDetail.id)} src={redlike} alt=""/>
                    <p className={styles.detailUser}>{boardDetail.user.nickname}</p>
                  </div> : 
                  <div className={styles.heartBox}>
                    <img className={styles.heartImg} onClick={()=>likeBoard(boardDetail.id)} src={nolike} alt=""/>
                    <p className={styles.detailUser}>{boardDetail.user.nickname}</p>
                  </div>
                }
                <p className={styles.detailContent}>{boardDetail.content}</p>
                <div className={styles.commentBox}>
                  <input
                    className={styles.commentInput}
                    placeholder="?????? ??????..."
                    maxLength={100}
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                    value={comment}
                    />
                    { comment==='' ? 
                      <img className={styles.sendImg} src={send} alt=""/>:
                      <img className={styles.sendImg} onClick={()=>{commentWrite(boardDetail.id);setComment('')}} src={send} alt=""/>
                    }
                </div>
          
                {
                  commentList.map((comment)=>{
                    return(
                      <Comment 
                        boardId={boardDetail.id}
                        comment={comment}
                        setCommentList={setCommentList}
                      />
                    )
                  })
                }
              </div> : null}
            
            {/* ??????3 ?????? ???????????? */}
            {boardNum==='3' ? 
            <div className={styles.ListBox}>
            {/* ?????????????????? */}
            <div className={styles.CategoryBox}>
              <select className={styles.Category} value={selected} onChange={(e) => {
                    setSelected(e.target.value);
                    setBoardNum(e.target.value);
                }}>
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              ))}
              </select>
            </div>
              {/* ??? ??? ?????? */}
            {
              boardList.map((board)=>{
                console.log(board)
              })
            }
            <p onClick={()=>{setBoardNum('4');setCategory('mission3');}} className={styles.NewText}>+ ??? ??? ??????</p>
            <div className={styles.List}>
              {
                boardList.map((board)=>{
                  if(board.category==="mission3"){
                    return(
                      <div 
                        key={board.id}
                        onClick={()=>{
                          loadDetail(board.id)
                          setBoardNum('5')
                        }} 
                      >
                        <Post 
                        board={board}
                        />
                      </div>
                    )
                  }
                  
                })
              }
            </div>
          </div> : null}

            {/*  ??????3 ?????? ???????????? ????????? ?????? ??? */}
            {boardNum==='4' ?
            <div>
              <div className={styles.PhotoBox}>
                <img
                  onClick={goodClick}
                  className={styles.Photo}
                  src={good}
                  alt="sample"
                  />
                <input
                  type="file"
                  name="imgUpload"
                  accept="image/*"
                  onChange={saveGoodFileImage}
                  style={{ display: "none" }}
                  ref={goodInput}
                  />
              </div>
              <div className={styles.InputBox}>
                <p className={styles.InputCategory}>?????? : ??????3 ?????? ????????????</p>
                <div>
                  <label className={styles.LabelFont} for="title">?????? : </label>
                  <input className={styles.InputTitle} id="title" 
                         onChange={(e) => {setTitle(e.target.value);}}
                         maxLength={25}/>
                </div>
                <div className={styles.ContextBox}>
                  <label className={styles.LabelFont} for="content">?????? : </label>
                  <textarea className={styles.InputContext} id="content" 
                            onChange={(e) => {setContent(e.target.value);}}
                            maxLength={1000}/>
                </div>
              </div>
              <img className={styles.backImg} src={back} alt="" onClick={()=>{setBoardNum('3');setSelected('3');}}/>
              <img className={styles.goImg} src={Go} alt="" 
                   onClick={()=>{boardWrite();}}/>
            </div>
              :null
            }

            {/* ??????3 ?????? ???????????? ??????????????? */}
            {boardNum==='5' && boardDetail? 
              <div className={styles.DetailBox}>
              {console.log("boardDetail",boardDetail)}
              <img onClick={()=>{setBoardNum('3')}} className={styles.boardBack} src={boardBack} alt=""/>
              <p className={styles.detailTitle}>{boardDetail.title}</p>
              <div><img className={styles.detailImg} src={eximg} alt=""/></div>
              {likeState ? 
                <div className={styles.heartBox}>
                  <img className={styles.heartImg} onClick={()=>likeBoard(boardDetail.id)} src={redlike} alt=""/>
                  <p className={styles.detailUser}>{boardDetail.user.nickname}</p>
                </div> : 
                <div className={styles.heartBox}>
                  <img className={styles.heartImg} onClick={()=>likeBoard(boardDetail.id)} src={nolike} alt=""/>
                  <p className={styles.detailUser}>{boardDetail.user.nickname}</p>
                </div>
              }
              <p className={styles.detailContent}>{boardDetail.content}</p>
              <div className={styles.commentBox}>
                <input
                  className={styles.commentInput}
                  placeholder="?????? ??????..."
                  maxLength={100}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                  value={comment}
                  />
                  { comment==='' ? 
                    <img className={styles.sendImg} src={send} alt=""/>:
                    <img className={styles.sendImg} onClick={()=>{commentWrite(boardDetail.id);setComment('')}} src={send} alt=""/>
                  }
              </div>
        
              {
                commentList.map((comment)=>{
                  return(
                    <Comment 
                      boardId={boardDetail.id}
                      comment={comment}
                      setCommentList={setCommentList}
                    />
                  )
                })
              }
            </div>  : null}

          <div style={{ position: "absolute", left: "32px", top: "72px" }}>
            {/* <p className={styles.BoardText}>?????? ???????????? ????????????????????????.</p> */}
          </div>
        </div>
      </div> 
  );
}

function Menu(){
  const [openModal, setOpenModal] = useState(false);
  const showModal = () => {
    setOpenModal(true);
  };
  const [openBoard, setOpenBoard] = useState(false);
  const showBoard = () => {
    setOpenBoard(true);
  };

  const [state,setState] = useState(false);
  const onClick = () => {
    setState(!state)
  }
  const navigate = useNavigate();
  const goToMain = () => {
    navigate("/");
  };
  return(
  <div className={styles.menu}>
    <img onClick={goToMain} className={state ? styles.show1 : styles.hidden} src={home} alt=""/>
    <img onClick={showBoard} className={state ? styles.show2 : styles.hidden} src={board} alt=""/>
    <img onClick={showModal} className={state ? styles.show3 : styles.hidden} src={logout} alt=""/>
    <img onClick={onClick} className={styles.bar} src={hamburger} alt=""/>
    {openModal && (
          <Modal
            open={openModal}
            onClose={() => {
              setOpenModal(false);
            }}
          />
        )}
    {openBoard && (
          <Board
            open={openBoard}
            onClose={() => {
              setOpenBoard(false);
            }}
          />
        )}
  </div>
  )
}
export default Menu;