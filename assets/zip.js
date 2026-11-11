(function(){'use strict';
var d=document,S=window.SYG,$=function(s){return d.querySelector(s)};
var f=$('[data-filter]');
if(f){var rows=[].slice.call(d.querySelectorAll(f.getAttribute('data-filter'))),none=$('[data-none]');
 f.addEventListener('input',function(){var q=f.value.trim().toLowerCase(),n=0;rows.forEach(function(r){var hit=!q||(r.getAttribute('data-k')||r.textContent).toLowerCase().indexOf(q)>-1;r.hidden=!hit;if(hit)n++});if(none)none.hidden=n>0})}
var form=$('#zp-form');if(!form)return;
var box=$('#zp-q'),res=$('#zp-res'),rec=$('#zp-recent'),ZC={},PC={};
function recent(item){var l=S.recent('zip-recent',item);if(!l.length){rec.hidden=true;return}rec.hidden=false;rec.innerHTML='<b>Recent:</b> <span class="chips" style="display:inline-flex">'+l.map(function(x){return '<button type="button" data-z="'+S.esc(x.u)+'">'+S.esc(x.u)+' '+S.esc(x.t)+'</button>'}).join('')+'</span>'}
function fail(t,h){res.hidden=false;res.className='result rise';res.innerHTML='<h2>'+t+'</h2>'+h}
function showZip(z){var k=z.slice(0,3);
 var done=function(j){var r=j[z];
  if(!r)return fail('ZIP code '+S.esc(z)+' is not in our list','<p>Check the five digits. Some ZIP codes for single buildings, post office boxes or new areas are not in the open data this site uses. For mail, confirm with the United States Postal Service.</p>');
  var cu='/state/'+r[5]+'/'+r[6]+'/',txt=z+' is the ZIP code of '+r[0]+', '+r[1]+' ('+r[2]+')';
  res.hidden=false;res.className='result rise';
  res.innerHTML='<h2>ZIP code '+z+'</h2><p class="big">'+S.esc(r[0])+', '+r[1]+'</p><dl class="facts"><dt>Place</dt><dd>'+S.esc(r[0])+'</dd><dt>State</dt><dd><a href="/state/'+r[5]+'/">'+S.esc(r[7])+'</a> ('+r[1]+')</dd><dt>County</dt><dd><a href="'+cu+'">'+S.esc(r[2])+'</a></dd>'+
   (r[8]!=null?'<dt>Land area</dt><dd>'+r[8]+' square miles ('+(r[8]*2.58999).toFixed(1)+' sq km)</dd>':'')+'<dt>Location</dt><dd>'+r[3]+', '+r[4]+' <a href="https://www.openstreetmap.org/?mlat='+r[3]+'&mlon='+r[4]+'#map=11/'+r[3]+'/'+r[4]+'" target="_blank" rel="noopener">Open map</a></dd><dt>Address line</dt><dd>'+S.esc(r[0])+', '+r[1]+' '+z+'</dd></dl>'+
   '<div class="acts"><button class="btn sm" type="button" data-copy="'+S.esc(r[0]+', '+r[1]+' '+z)+'" data-done="Address line copied">Copy address line</button><button class="btn sm ghost" type="button" data-share="'+S.esc(txt)+'">Share</button><a class="btn sm ghost" href="'+cu+'">All ZIP codes in '+S.esc(r[2])+'</a></div>'+
   '<p class="hint">Place names follow the open GeoNames list; a ZIP code can serve more than one town. For mailing, confirm the address with the United States Postal Service.</p>';
  recent({u:z,t:r[0]+', '+r[1]})};
 if(ZC[k])return done(ZC[k]);
 res.hidden=false;res.className='result';res.innerHTML='<div class="shim"></div>';
 S.json('/data/z/'+k+'.json').then(function(j){ZC[k]=j;done(j)},function(){fail('No ZIP codes start with '+S.esc(k),'<p>Check the digits and try again.</p>')})}
function showPlace(q){var L=q.charAt(0).toLowerCase();
 if(!/[a-z]/.test(L))return fail('Type a ZIP code or a place name','<p>For example 90210, or Austin.</p>');
 var done=function(j){var ql=q.toLowerCase().replace(/,\s*/,' ').replace(/\s+/g,' '),m=ql.match(/^(.*) ([a-z]{2})$/),name=ql,st='';
  var hits=j.filter(function(p){return p[0].toLowerCase().indexOf(name)===0});
  if(m){var h2=j.filter(function(p){return p[0].toLowerCase().indexOf(m[1])===0&&p[1].toLowerCase()===m[2]});if(h2.length){hits=h2}}
  if(!hits.length)return fail('No place found for "'+S.esc(q)+'"','<p>Type the first letters of a city or town, optionally with the state letters, such as "Springfield IL". Or browse by <a href="/state/">state</a>.</p>');
  hits.sort(function(a,b){return (a[0].length-b[0].length)||b[2].length-a[2].length});
  var more=hits.length>40;hits=hits.slice(0,40);
  res.hidden=false;res.className='result rise';
  res.innerHTML='<h2>Places matching "'+S.esc(q)+'"</h2><ul class="zp-list">'+hits.map(function(p){return '<li><button type="button" data-z="'+p[2][0]+'">'+S.esc(p[0])+', '+p[1]+'<span>'+(p[2].length===1?p[2][0]:p[2][0]+' and '+(p[2].length-1)+' more')+'</span></button></li>'}).join('')+'</ul>'+(more?'<p class="hint">Showing the first 40. Add the state letters to narrow it, for example "'+S.esc(q)+' TX".</p>':'<p class="hint">Tap a place to see its ZIP code. Where a place has several, the county page lists them all.</p>')};
 if(PC[L])return done(PC[L]);
 res.hidden=false;res.className='result';res.innerHTML='<div class="shim"></div>';
 S.json('/data/p/'+L+'.json').then(function(j){PC[L]=j;done(j)},function(){fail('Could not load the list','<p>Please check your connection and try again.</p>')})}
function go(){var q=box.value.trim();if(!q){res.hidden=true;return}var z=q.replace(/[\s-]/g,'');
 if(/^\d{5}(\d{4})?$/.test(z))showZip(z.slice(0,5));else if(/^\d+$/.test(z))fail('A ZIP code has five digits','<p>You typed '+z.length+'. Add the missing digits, including any zero at the start (for example 02108).</p>');else showPlace(q)}
form.addEventListener('submit',function(e){e.preventDefault();go()});
d.addEventListener('click',function(e){var b=e.target.closest('[data-z]');if(b){box.value=b.getAttribute('data-z');showZip(box.value);res.scrollIntoView({block:'nearest'})}});
recent();var h=location.hash.replace('#','');if(/^\d{5}$/.test(h)){box.value=h;showZip(h)}
})();