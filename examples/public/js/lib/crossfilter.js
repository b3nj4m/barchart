(function(a){function b(a){return a}function c(a,b){for(var c=0,d=b.length,e=new Array(d);c<d;++c)e[c]=a[b[c]];return e}function e(a){function b(b,c,d,e){while(d<e){var f=d+e>>1;a(b[f])<c?d=f+1:e=f}return d}function c(b,c,d,e){while(d<e){var f=d+e>>1;c<a(b[f])?e=f:d=f+1}return d}return c.right=c,c.left=b,c}function g(a){function b(a,b,c){var e=c-b,f=(e>>>1)+1;while(--f>0)d(a,f,e,b);return a}function c(a,b,c){var e=c-b,f;while(--e>0)f=a[b],a[b]=a[b+e],a[b+e]=f,d(a,1,e,b);return a}function d(b,c,d,e){var f=b[--e+c],g=a(f),h;while((h=c<<1)<=d){h<d&&a(b[e+h])>a(b[e+h+1])&&h++;if(g<=a(b[e+h]))break;b[e+c]=b[e+h],c=h}b[e+c]=f}return b.sort=c,b}function i(a){function c(c,d,e,f){var g=new Array(f=Math.min(e-d,f)),h,i,j,k;for(i=0;i<f;++i)g[i]=c[d++];b(g,0,f);if(d<e){h=a(g[0]);do if(j=a(k=c[d])>h)g[0]=k,h=a(b(g,0,f)[0]);while(++d<e)}return g}var b=g(a);return c}function k(a){function b(b,c,d){for(var e=c+1;e<d;++e){for(var f=e,g=b[e],h=a(g);f>c&&a(b[f-1])>h;--f)b[f]=b[f-1];b[f]=g}return b}return b}function m(a){function c(a,c,e){return(e-c<n?b:d)(a,c,e)}function d(b,d,e){var f=(e-d)/6|0,g=d+f,h=e-1-f,i=d+e-1>>1,j=i-f,k=i+f,l=b[g],m=a(l),n=b[j],o=a(n),p=b[i],q=a(p),r=b[k],s=a(r),t=b[h],u=a(t),v;m>o&&(v=l,l=n,n=v,v=m,m=o,o=v),s>u&&(v=r,r=t,t=v,v=s,s=u,u=v),m>q&&(v=l,l=p,p=v,v=m,m=q,q=v),o>q&&(v=n,n=p,p=v,v=o,o=q,q=v),m>s&&(v=l,l=r,r=v,v=m,m=s,s=v),q>s&&(v=p,p=r,r=v,v=q,q=s,s=v),o>u&&(v=n,n=t,t=v,v=o,o=u,u=v),o>q&&(v=n,n=p,p=v,v=o,o=q,q=v),s>u&&(v=r,r=t,t=v,v=s,s=u,u=v);var w=n,x=o,y=r,z=s;b[g]=l,b[j]=b[d],b[i]=p,b[k]=b[e-1],b[h]=t;var A=d+1,B=e-2,C=x<=z&&x>=z;if(C)for(var D=A;D<=B;++D){var E=b[D],F=a(E);if(F<x)D!==A&&(b[D]=b[A],b[A]=E),++A;else if(F>x)for(;;){var G=a(b[B]);if(G>x){B--;continue}if(G<x){b[D]=b[A],b[A++]=b[B],b[B--]=E;break}b[D]=b[B],b[B--]=E;break}}else for(var D=A;D<=B;D++){var E=b[D],F=a(E);if(F<x)D!==A&&(b[D]=b[A],b[A]=E),++A;else if(F>z)for(;;){var G=a(b[B]);if(G>z){B--;if(B<D)break;continue}G<x?(b[D]=b[A],b[A++]=b[B],b[B--]=E):(b[D]=b[B],b[B--]=E);break}}b[d]=b[A-1],b[A-1]=w,b[e-1]=b[B+1],b[B+1]=y,c(b,d,A-1),c(b,B+2,e);if(C)return b;if(A<g&&B>h){var H,G;while((H=a(b[A]))<=x&&H>=x)++A;while((G=a(b[B]))<=z&&G>=z)--B;for(var D=A;D<=B;D++){var E=b[D],F=a(E);if(F<=x&&F>=x)D!==A&&(b[D]=b[A],b[A]=E),A++;else if(F<=z&&F>=z)for(;;){var G=a(b[B]);if(G<=z&&G>=z){B--;if(B<D)break;continue}G<x?(b[D]=b[A],b[A++]=b[B],b[B--]=E):(b[D]=b[B],b[B--]=E);break}}}return c(b,A,B+1)}var b=k(a);return c}function t(a){return new Array(a)}function u(a,b){return function(c){var d=c.length;return[a.left(c,b,0,d),a.right(c,b,0,d)]}}function v(a,b){var c=b[0],d=b[1];return function(b){var e=b.length;return[a.left(b,c,0,e),a.left(b,d,0,e)]}}function w(a){return[0,a.length]}function x(){return null}function y(){return 0}function z(a){return a+1}function A(a){return a-1}function B(a){return function(b,c){return b+ +a(c)}}function C(a){return function(b,c){return b-a(c)}}function D(){function p(b){var c=f,d=b.length;return d&&(e=e.concat(b),k=r(k,f+=d),n.forEach(function(a){a(b,c,d)})),a}function q(a){function P(b,d,e){H=b.map(a),I=J(F(e),0,e),H=c(H,I);var g=K(H),h=g[0],i=g[1],j;for(j=0;j<h;++j)k[I[j]+d]|=p;for(j=i;j<e;++j)k[I[j]+d]|=p;if(!d){t=H,D=I,N=h,O=i;return}var l=t,m=D,n=0,o=0;t=new Array(f),D=E(f,f);for(j=0;n<d&&o<e;++j)l[n]<H[o]?(t[j]=l[n],D[j]=m[n++]):(t[j]=H[o],D[j]=I[o++]+d);for(;n<d;++n,++j)t[j]=l[n],D[j]=m[n];for(;o<e;++o,++j)t[j]=H[o],D[j]=I[o]+d;g=K(t),N=g[0],O=g[1]}function Q(a,b,c){L.forEach(function(a){a(H,I,b,c)}),H=I=null}function R(a){var b,c,d,e=a[0],f=a[1],g=[],h=[];if(e<N)for(b=e,c=Math.min(N,f);b<c;++b)k[d=D[b]]^=p,g.push(d);else if(e>N)for(b=N,c=Math.min(e,O);b<c;++b)k[d=D[b]]^=p,h.push(d);if(f>O)for(b=Math.max(e,O),c=f;b<c;++b)k[d=D[b]]^=p,g.push(d);else if(f<O)for(b=Math.max(N,f),c=O;b<c;++b)k[d=D[b]]^=p,h.push(d);return N=e,O=f,l.forEach(function(a){a(p,g,h)}),o}function S(a){return a==null?V():Array.isArray(a)?U(a):T(a)}function T(a){return R((K=u(d,a))(t))}function U(a){return R((K=v(d,a))(t))}function V(){return R((K=w)(t))}function W(a){var b=[],c=O,d;while(--c>=N&&a>0)k[d=D[c]]||(b.push(e[d]),--a);return b}function X(a){var b=[],c=N,d;while(c<O&&a>0)k[d=D[c]]||(b.push(e[d]),--a),c++;return b}function Y(a){function K(b,c,g,i){function Q(){++n===m&&(p=s(p,j<<=1),h=s(h,j),m=G(j))}var o=d,p=E(n,m),t=v,u=F,w=n,y=0,z=0,A,B,C,D,K,L;J&&(t=u=x),d=new Array(n),n=0,h=w>1?r(h,f):E(f,m),w&&(C=(B=o[0]).key);while(z<i&&!((D=a(b[z]))>=D))++z;while(z<i){if(B&&C<=D){K=B,L=C,p[y]=n;if(B=o[++y])C=B.key}else K={key:D,value:u()},L=D;d[n]=K;while(!(D>L)){h[A=c[z]+g]=n,k[A]&q||(K.value=t(K.value,e[A]));if(++z>=i)break;D=a(b[z])}Q()}while(y<w)d[p[y]=n]=o[y++],Q();if(n>y)for(y=0;y<g;++y)h[y]=p[h[y]];A=l.indexOf(H),n>1?(H=M,I=O):(n===1?(H=N,I=P):(H=x,I=x),h=null),l[A]=H}function M(a,b,c){if(a===p||J)return;var f,g,i,j;for(f=0,i=b.length;f<i;++f)k[g=b[f]]&q||(j=d[h[g]],j.value=v(j.value,e[g]));for(f=0,i=c.length;f<i;++f)(k[g=c[f]]&q)===a&&(j=d[h[g]],j.value=w(j.value,e[g]))}function N(a,b,c){if(a===p||J)return;var f,g,h,i=d[0];for(f=0,h=b.length;f<h;++f)k[g=b[f]]&q||(i.value=v(i.value,e[g]));for(f=0,h=c.length;f<h;++f)(k[g=c[f]]&q)===a&&(i.value=w(i.value,e[g]))}function O(){var a,b;for(a=0;a<n;++a)d[a].value=F();for(a=0;a<f;++a)k[a]&q||(b=d[h[a]],b.value=v(b.value,e[a]))}function P(){var a,b=d[0];b.value=F();for(a=0;a<f;++a)k[a]&q||(b.value=v(b.value,e[a]))}function Q(){return J&&(I(),J=!1),d}function R(a){var b=o(Q(),0,d.length,a);return u.sort(b,0,b.length)}function S(a,b,d){return v=a,w=b,F=d,J=!0,c}function T(){return S(z,A,y)}function U(a){return S(B(a),C(a),y)}function V(a){function b(b){return a(b.value)}return o=i(b),u=g(b),c}function W(){return V(b)}function X(){return n}var c={top:R,all:Q,reduce:S,reduceCount:T,reduceSum:U,order:V,orderNatural:W,size:X},d,h,j=8,m=G(j),n=0,o,u,v,w,F,H=x,I=x,J=!0;return arguments.length<1&&(a=b),l.push(H),L.push(K),K(t,D,0,f),T().orderNatural()}function Z(){var a=Y(x),b=a.all;return delete a.all,delete a.top,delete a.order,delete a.orderNatural,delete a.size,a.value=function(){return b()[0].value},a}var o={filter:S,filterExact:T,filterRange:U,filterAll:V,top:W,bottom:X,group:Y,groupAll:Z},p=1<<h++,q=~p,t,D,H,I,J=m(function(a){return H[a]}),K=w,L=[],N=0,O=0;return n.unshift(P),n.push(Q),h>j&&(k=s(k,j<<=1)),P(e,0,f),Q(e,0,f),o}function t(){function i(a,d,g){var i;if(h)return;for(i=d;i<f;++i)k[i]||(b=c(b,e[i]))}function j(a,f,g){var i,j,l;if(h)return;for(i=0,l=f.length;i<l;++i)k[j=f[i]]||(b=c(b,e[j]));for(i=0,l=g.length;i<l;++i)k[j=g[i]]===a&&(b=d(b,e[j]))}function m(){var a;b=g();for(a=0;a<f;++a)k[a]||(b=c(b,e[a]))}function o(b,e,f){return c=b,d=e,g=f,h=!0,a}function p(){return o(z,A,y)}function q(a){return o(B(a),C(a),y)}function r(){return h&&(m(),h=!1),b}var a={reduce:o,reduceCount:p,reduceSum:q,value:r},b,c,d,g,h=!0;return l.push(j),n.push(i),i(e,0,f),p()}function D(){return f}var a={add:p,dimension:q,groupAll:t,size:D},e=[],f=0,h=0,j=8,k=o(0),l=[],n=[];return arguments.length?p(arguments[0]):a}function E(a,b){return(b<257?o:b<65537?p:q)(a)}function F(a){var b=E(a,a);for(var c=-1;++c<a;)b[c]=c;return b}function G(a){return a===8?256:a===16?65536:4294967296}D.version="1.1.0",D.permute=c;var d=D.bisect=e(b);d.by=e;var f=D.heap=g(b);f.by=g;var h=D.heapselect=i(b);h.by=i;var j=D.insertionsort=k(b);j.by=k;var l=D.quicksort=m(b);l.by=m;var n=32,o=t,p=t,q=t,r=b,s=b;typeof Uint8Array!="undefined"&&(o=function(a){return new Uint8Array(a)},p=function(a){return new Uint16Array(a)},q=function(a){return new Uint32Array(a)},r=function(a,b){var c=new a.constructor(b);return c.set(a),c},s=function(a,b){var c;switch(b){case 16:c=p(a.length);break;case 32:c=q(a.length);break;default:throw new Error("invalid array width!")}return c.set(a),c}),a.crossfilter=D})(this);