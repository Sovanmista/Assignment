const http=require('http');

function getstories(url,callback){
  http.get(url,(response)=>{
    let html='';
    response.on('data',(parts)=>{
      html+=parts;
    });
    response.on('end',()=>{
      const stories=parsestories(html);
      callback(stories);
    });
  }).on('error',(error)=>{
    callback(error);
  });
}

function parsestories(content){
  const stories=[];
  let Title=false;
  let title='';
  let Link=false;
  let link='';
  let url='';

  for (let i=0;i<content.length;i++){
    const char=content[i];
    if(Title && char!=='>'){
      title+=char;
    }
    else if (Link && char!=='"'){
      url+=char;
    }
    if(char==='<'){
      Title=(content.substr(i,3)==='<h1>'||content.substr(i,4)==='<h2>');
      Link=(content.substr(i,9)==='<a href="');
      title='';
      url='';
    }
    else if(char==='>' && Title){
      Title=false;
      if(title.trim()){
        stories.push({title: title.trim()});
      }
    }
    else if(char==='"' && Link){
      Link=false;
      if(url.trim()){
        stories[stories.length-1].link=url.trim();
      }
    }
  }
  return stories.slice(0,6);
}

// Example usage:
const targetUrl='https://time.com/';
getstories(targetUrl,(stories,error)=>{
  if (error){
    console.error(error);
  } 
  else{
    console.log(JSON.stringify(stories));
  }
});